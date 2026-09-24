import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn("Could not initialize GoogleGenAI with provided key:", err);
      aiClient = null;
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "TESPROY Academic Hub API", timestamp: new Date().toISOString() });
  });

  // 1. Detección Inteligente de Abandono y Generación de Solicitud de Donación
  app.post("/api/ai/detect-abandonment", async (req, res) => {
    try {
      const { proyecto, dias_inactividad, meses_inactividad, actividades_pendientes, integrantes } = req.body;
      const meses = typeof meses_inactividad === 'number'
        ? meses_inactividad
        : typeof proyecto?.meses_inactividad === 'number'
        ? proyecto.meses_inactividad
        : Math.round((Number(dias_inactividad) || 150) / 30);

      const ai = getGenAI();

      if (ai) {
        const prompt = `Actúa como el sistema de Inteligencia Artificial del repositorio académico TESPROY del Tecnológico de Estudios Superiores de Chimalhuacán (TESCHI).
Analiza el estado de este proyecto estudiantil para determinar si está en riesgo de abandono y generar una solicitud académica formal para que el equipo lo done al repositorio para estudiantes de 7mo a 9no semestre.

Regla normativa de abandono:
- Se considera formalmente ABANDONO a partir de los 5 meses que no se suba nada (sin commits ni entregables).
- Entre 3 y 4 meses sin subir nada se considera EN RIESGO.
- Menos de 3 meses se considera ACTIVO.

Datos del Proyecto:
- Nombre: ${proyecto.nombre}
- Asignatura: ${proyecto.asignatura}
- Semestre: ${proyecto.semestre}
- Meses de inactividad (sin subir nada): ${meses} meses
- Progreso / Porcentaje de Terminado: ${proyecto.progreso}%
- Actividades pendientes: ${actividades_pendientes}
- Descripción: ${proyecto.descripcion}
- Integrantes originales: ${integrantes ? integrantes.join(", ") : "Equipo registrado"}

Devuelve ÚNICAMENTE un objeto JSON válido (sin markdown, sin comillas invertidas) con el siguiente formato exacto:
{
  "score": número del 0 al 100 indicando probabilidad de abandono,
  "estado": "activo" | "en_riesgo" | "abandonado",
  "diagnostico": "Explicación técnica y académica clara considerando que a partir de 5 meses sin subir nada se considera abandono",
  "factores_riesgo": ["factor 1", "factor 2", "factor 3"],
  "carta_solicitud_donacion": "Texto formal, empático e institucional dirigido al equipo estudiantil solicitando formalmente donar el proyecto al repositorio del TESCHI para evitar pérdida de código y permitir que compañeros de 7mo a 9no semestre continúen su desarrollo como residencia profesional o proyecto de titulación",
  "recomendacion_accion": "Pasos a seguir por el coordinador académico"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const rawText = response.text || "{}";
        try {
          const parsed = JSON.parse(rawText);
          return res.json({ success: true, data: parsed });
        } catch {
          // Clean possible markdown ticks
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          return res.json({ success: true, data: JSON.parse(cleaned) });
        }
      }

      // Heurística de respaldo inteligente si no hay API key configurada
      const progreso = Number(proyecto.progreso) || 30;
      let estado: 'activo' | 'en_riesgo' | 'abandonado' = 'activo';
      let score = Math.min(99, Math.round((meses / 8) * 70 + (100 - progreso) * 0.3));

      if (meses >= 5) {
        estado = 'abandonado';
        score = Math.max(score, 85);
      } else if (meses >= 3) {
        estado = 'en_riesgo';
        score = Math.max(score, 50);
      }

      const fallbackResult = {
        score,
        estado,
        diagnostico: `Análisis heurístico TESCHI: Proyecto con ${meses} meses sin subir nada al repositorio y avance al ${progreso}%. ${
          meses >= 5 
            ? 'Supera el umbral institucional de 5 meses sin actividad, dictaminándose formalmente como proyecto abandonado.' 
            : meses >= 3
            ? 'Presenta entre 3 y 4 meses de inactividad, catalogado en riesgo de abandono académico.'
            : 'Mantiene ritmo de actualización aceptable.'
        }`,
        factores_riesgo: [
          meses >= 5 ? `Inactividad crítica (${meses} meses sin subir cambios, excediendo el límite de 5 meses)` : `Inactividad acumulada (${meses} meses sin commits)`,
          `Actividades pendientes del semestre ${proyecto.semestre || 'en curso'}`,
          `Porcentaje de terminado actual (${progreso}%) por debajo del cronograma oficial`
        ],
        carta_solicitud_donacion: `Estimado equipo de "${proyecto.nombre}":\n\nPor medio del Sistema de Repositorio Académico TESPROY del TESCHI, reconocemos el gran valor técnico y esfuerzo invertido en su proyecto para la asignatura de ${proyecto.asignatura}.\n\nDado que han transcurrido ${meses} meses sin registrar entregas ni commits en el repositorio institucional (superando el límite de 5 meses de inactividad), los invitamos cordialmente a donar su código y documentación a la comunidad académica. Esta donación permitirá que estudiantes de 7mo a 9no semestre continúen su desarrollo como residencia profesional o proyecto de titulación, preservando su autoría intelectual original y beneficiando al instituto.\n\nAtentamente,\nCoordinación de Proyectos y Residencias - TESCHI`,
        recomendacion_accion: estado === 'abandonado' ? 'Activar proceso de donación al banco institucional de proyectos para estudiantes de 7mo a 9no semestre.' : 'Enviar recordatorio preventivo al líder de equipo y asesor.'
      };

      return res.json({ success: true, data: fallbackResult });
    } catch (error: any) {
      console.error("Error in detect-abandonment:", error);
      res.status(500).json({ success: false, error: error.message || "Error al procesar solicitud" });
    }
  });

  // 2. Evaluación de Compatibilidad de Alumno con Proyecto Donado (Matching Alumno-Proyecto)
  app.post("/api/ai/evaluate-student-match", async (req, res) => {
    try {
      const { estudiante, proyecto } = req.body;
      const ai = getGenAI();

      if (ai) {
        const prompt = `Actúa como el Comité Evaluador Académico con IA del TESCHI (Tecnológico de Estudios Superiores de Chimalhuacán).
Evalúa si el siguiente estudiante de semestres avanzados (7mo a 9no) tiene el perfil técnico, académico y de trayectoria adecuado para tomar y continuar con éxito el proyecto donado "${proyecto.nombre}".

Perfil del Estudiante:
- Nombre: ${estudiante.nombre}
- Carrera: ${estudiante.carrera}
- Semestre: ${estudiante.semestre}
- Promedio General: ${estudiante.promedio} / 100
- Habilidades técnicas declaradas: ${Array.isArray(estudiante.habilidades) ? estudiante.habilidades.join(", ") : estudiante.habilidades}
- Trayectoria/Bio: ${estudiante.bio}

Datos del Proyecto Donado:
- Nombre: ${proyecto.nombre}
- Asignatura: ${proyecto.asignatura}
- Descripción: ${proyecto.descripcion}
- Tecnologías/Tags: ${Array.isArray(proyecto.tags) ? proyecto.tags.join(", ") : proyecto.tags}
- Avance actual a retomar: ${proyecto.progreso}%

Devuelve ÚNICAMENTE un objeto JSON válido con el siguiente formato:
{
  "score": número de 0 a 100 indicando afinidad global,
  "decision": "aprobado" | "condicional" | "no_recomendado",
  "recomendacion": "Resumen ejecutivo de una línea para el dictamen",
  "justificacion": "Justificación académica profunda considerando carrera, semestre, promedio y match de stack tecnológico",
  "puntos_fuertes": ["punto fuerte 1", "punto fuerte 2", "punto fuerte 3"],
  "aspectos_a_cubrir": ["aspecto a reforzar o capacitar"],
  "plan_sugerido_continuidad": "Plan de 3 fases recomendado para que el alumno retome el repositorio exitosamente"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const rawText = response.text || "{}";
        try {
          const parsed = JSON.parse(rawText);
          return res.json({ success: true, data: parsed });
        } catch {
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          return res.json({ success: true, data: JSON.parse(cleaned) });
        }
      }

      // Fallback matching inteligente basado en habilidades y semestre
      const promedio = Number(estudiante.promedio) || 85;
      const skills = Array.isArray(estudiante.habilidades) ? estudiante.habilidades : [];
      const tags = Array.isArray(proyecto.tags) ? proyecto.tags : [];
      const matches = skills.filter((s: string) => tags.some((t: string) => t.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(t.toLowerCase())));
      
      let baseScore = Math.min(98, Math.round((promedio * 0.5) + (matches.length * 15) + (estudiante.semestre?.includes('8') || estudiante.semestre?.includes('9') ? 15 : 10)));
      if (baseScore < 60) baseScore = 68;

      const decision: 'aprobado' | 'condicional' | 'no_recomendado' = baseScore >= 80 ? 'aprobado' : baseScore >= 65 ? 'condicional' : 'no_recomendado';

      const fallbackResult = {
        score: baseScore,
        decision,
        recomendacion: decision === 'aprobado' 
          ? `Perfil con alta viabilidad técnica para liderar "${proyecto.nombre}".` 
          : `Aprobación condicional sujeta a tutoría técnica en el stack del proyecto.`,
        justificacion: `El estudiante ${estudiante.nombre} se encuentra en ${estudiante.semestre || 'semestre terminal'} de ${estudiante.carrera} con un promedio de ${promedio}. Posee competencias alineadas en ${skills.slice(0, 3).join(', ')}, lo que permite una curva de adaptación ágil al código fuente existente.`,
        puntos_fuertes: [
          `Promedio académico sólido (${promedio}/100)`,
          `Afinidad directa con las tecnologías requeridas (${tags.slice(0, 2).join(', ')})`,
          `Nivel de madurez de ${estudiante.semestre || 'semestres avanzados'} para trabajo autónomo`
        ],
        aspectos_a_cubrir: [
          `Familiarización con la estructura de base de datos y endpoints heredados`,
          `Actualización de librerías a versiones actuales vigentes`
        ],
        plan_sugerido_continuidad: `Fase 1: Auditoría de código heredado y replicación local. Fase 2: Implementación de nuevos requerimientos funcionales. Fase 3: Pruebas de integración y entrega de residencias.`
      };

      return res.json({ success: true, data: fallbackResult });
    } catch (error: any) {
      console.error("Error in evaluate-student-match:", error);
      res.status(500).json({ success: false, error: error.message || "Error al evaluar compatibilidad" });
    }
  });

  // 3. Reasignación Inteligente de Profesor / Asesor por Temática de Especialidad
  app.post("/api/ai/reassign-advisor", async (req, res) => {
    try {
      const { proyecto, maestro_actual, lista_maestros, motivo_cambio } = req.body;
      const ai = getGenAI();

      if (ai) {
        const prompt = `Actúa como la Coordinación Académica del TESCHI.
Se necesita asignar o reasignar un profesor asesor para el proyecto académico "${proyecto.nombre}" porque ${motivo_cambio || "el asesor original ya no se encuentra disponible o no coincide con la temática específica del trabajo"}.

Datos del Proyecto:
- Nombre: ${proyecto.nombre}
- Asignatura: ${proyecto.asignatura}
- Temática / Tags: ${Array.isArray(proyecto.tags) ? proyecto.tags.join(", ") : proyecto.tags}
- Descripción: ${proyecto.descripcion}
- Asesor actual o previo: ${maestro_actual ? maestro_actual.nombre : "Sin asesor"}

Lista de Profesores Disponibles del TESCHI:
${JSON.stringify(lista_maestros, null, 2)}

Analiza qué profesor tiene la mayor especialización, perfil temático y capacidad para guiar con éxito este proyecto al éxito académico.

Devuelve ÚNICAMENTE un objeto JSON válido con el siguiente formato:
{
  "maestro_sugerido_id": ID del maestro más idóneo,
  "maestro_nombre": "Nombre del maestro",
  "compatibilidad": número del 0 al 100,
  "motivo_academico": "Explicación detallada de por qué este profesor es la mejor opción para esta temática específica",
  "afinidad_tematica": ["área 1", "área 2", "área 3"],
  "experiencia_relevante": "Detalle de experiencia del docente que potenciará el trabajo del alumno",
  "segunda_opcion": {
    "maestro_sugerido_id": ID segunda opción,
    "maestro_nombre": "Nombre de la alternativa",
    "compatibilidad": número del 0 al 100,
    "motivo": "Breve explicación"
  }
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const rawText = response.text || "{}";
        try {
          const parsed = JSON.parse(rawText);
          return res.json({ success: true, data: parsed });
        } catch {
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          return res.json({ success: true, data: JSON.parse(cleaned) });
        }
      }

      // Fallback matching heurístico por palabras clave de especialidades
      const desc = `${proyecto.nombre} ${proyecto.descripcion} ${proyecto.asignatura} ${(proyecto.tags || []).join(' ')}`.toLowerCase();
      
      let bestTeacher = lista_maestros[0];
      let bestScore = 70;
      let matchedSpecialties: string[] = [];

      for (const m of (lista_maestros || [])) {
        let currentScore = 50;
        const currentMatches: string[] = [];
        for (const esp of (m.especialidades || [])) {
          if (desc.includes(esp.toLowerCase()) || esp.toLowerCase().split(' ').some((word: string) => word.length > 4 && desc.includes(word))) {
            currentScore += 20;
            currentMatches.push(esp);
          }
        }
        if (currentScore > bestScore) {
          bestScore = Math.min(96, currentScore);
          bestTeacher = m;
          matchedSpecialties = currentMatches;
        }
      }

      const fallbackResult = {
        maestro_sugerido_id: bestTeacher.id,
        maestro_nombre: bestTeacher.nombre,
        compatibilidad: bestScore,
        motivo_academico: `El perfil docente de ${bestTeacher.nombre} cuenta con alta especialización en las áreas clave de este proyecto (${(bestTeacher.especialidades || []).slice(0, 3).join(', ')}), garantizando rigor metodológico y continuidad exitosa.`,
        afinidad_tematica: matchedSpecialties.length > 0 ? matchedSpecialties : (bestTeacher.especialidades || []).slice(0, 3),
        experiencia_relevante: `Amplia trayectoria en asesoría de proyectos de ${bestTeacher.departamento} y laboratorio institucional.`,
        segunda_opcion: {
          maestro_sugerido_id: lista_maestros[1]?.id || lista_maestros[0]?.id,
          maestro_nombre: lista_maestros[1]?.nombre || "Profesor Alternativo",
          compatibilidad: 82,
          motivo: "Docente con disponibilidad horaria y perfil afín a ingeniería de software."
        }
      };

      return res.json({ success: true, data: fallbackResult });
    } catch (error: any) {
      console.error("Error in reassign-advisor:", error);
      res.status(500).json({ success: false, error: error.message || "Error al sugerir reasignación de asesor" });
    }
  });

  // 4. Centro de 5 Agentes de IA para la Implementación de Proyectos TESCHI
  app.post("/api/ai/student-assistant", async (req, res) => {
    try {
      const { pregunta, estudiante, proyecto, historial, agenteId } = req.body;
      const ai = getGenAI();

      if (!pregunta || typeof pregunta !== "string") {
        return res.status(400).json({ success: false, error: "La pregunta es requerida." });
      }

      // Identify selected agent
      const currentAgent = agenteId || 'metodologia';

      const agentProfiles: Record<string, { nombre: string; rol: string; especialidad: string; enfoque: string }> = {
        metodologia: {
          nombre: "Dr. Armando Flores V.",
          rol: "Asesor Metodológico & Titulación TESCHI",
          especialidad: "Protocolo de Residencia Profesional, Rúbricas Oficiales y Estructura Capitular",
          enfoque: "Estructura capitular formal (Capítulo 1 al 4), objetivos SMART, justificación metodológica, cronograma Gantt y alineación con rúbricas de titulación del TESCHI."
        },
        arquitectura: {
          nombre: "Ing. Roberto Soto M.",
          rol: "Arquitecto de Software & Hardware IoT",
          especialidad: "Diseño de Base de Datos (3FN), Diagramas UML y Arquitectura IoT",
          enfoque: "Modelado relacional normalizado (3FN), diagramas UML (casos de uso, secuencia, clases), contratos de APIs RESTful y conexión de sensores con microcontroladores ESP32/Arduino."
        },
        desarrollo: {
          nombre: "Lic. Carlos Morales E.",
          rol: "Desarrollador Senior & Generador de Código",
          especialidad: "Implementación de Código Funcional (TypeScript, React, Python, PHP, C++, SQL)",
          enfoque: "Generación directa de código funcional, limpio y modular (PHP PDO, componentes React con TypeScript, scripts Python, firmware en C++ y consultas SQL optimizadas)."
        },
        qa_seguridad: {
          nombre: "Dra. Maricela Rivas S.",
          rol: "Auditora de Calidad, Testing & Ciberseguridad",
          especialidad: "Auditoría de Vulnerabilidades OWASP, Pruebas Unitarias y Código Limpio",
          enfoque: "Detección de vulnerabilidades de seguridad (SQL Injection, XSS, sanitización, bcrypt, JWT), suites de pruebas unitarias (Jest, PyTest, PHPUnit) y principios SOLID."
        },
        rescate_donacion: {
          nombre: "Mtra. Yolanda González F.",
          rol: "Especialista en Diagnóstico, Rescate & Donación",
          especialidad: "Auditoría Forense de Abandono (Regla de 5+ Meses), Rescate y Adopción",
          enfoque: "Diagnóstico del porcentaje real de terminación, detección de deuda técnica, planes de rescate acelerados de 4 semanas y protocolo de donación/adopción para alumnos de 7mo a 9no semestre."
        }
      };

      const selectedProfile = agentProfiles[currentAgent] || agentProfiles.metodologia;

      if (ai) {
        const studentInfo = estudiante
          ? `Estudiante: ${estudiante.nombre}, Carrera: ${estudiante.carrera || "Ing. en Sistemas Computacionales"}, Semestre: ${estudiante.semestre || "8vo Semestre"}`
          : "Estudiante de 7mo a 9no semestre de TESCHI";

        const projectInfo = proyecto
          ? `Proyecto actual: "${proyecto.nombre}", Carrera: ${proyecto.carrera || "Ing. en Sistemas Computacionales"}, Asignatura: ${proyecto.asignatura || "N/A"}, % Terminado: ${proyecto.progreso || proyecto.calificacion || 0}%, Tecnologías: ${Array.isArray(proyecto.tags) ? proyecto.tags.join(", ") : (proyecto.tags || "N/A")}, Descripción: ${proyecto.descripcion || "N/A"}`
          : "Sin proyecto seleccionado";

        const historyContext = Array.isArray(historial) && historial.length > 0
          ? historial.map((h: any) => `${h.rol === 'user' ? 'Alumno' : selectedProfile.nombre}: ${h.texto}`).slice(-6).join("\n")
          : "Sin historial previo";

        const prompt = `Actúa como el "${selectedProfile.nombre}" (${selectedProfile.rol}), uno de los 5 Agentes de Inteligencia Artificial para la Implementación de Proyectos en el repositorio TESPROY del Tecnológico de Estudios Superiores de Chimalhuacán (TESCHI).

Tu especialidad técnica y académica:
${selectedProfile.especialidad}
Enfoque de tu asesoría:
${selectedProfile.enfoque}

Contexto del Alumno:
- ${studentInfo}
- ${projectInfo}

Historial reciente de conversación:
${historyContext}

Pregunta o Requerimiento del Alumno:
"${pregunta}"

Instrucciones de Respuesta:
1. Adopta la personalidad profesional, experta y empática de ${selectedProfile.nombre}. Saluda brevemente identificándote en tu rol.
2. Si eres el Asesor Metodológico: responde con rigor formal, rúbricas de titulación del TESCHI, justificaciones SMART y estructura capitular clara.
3. Si eres el Arquitecto de Software & Hardware: entrega especificaciones técnicas, esquemas relacionales DDL (3FN), diagramas en texto/Mermaid, y arquitecturas desacopladas con IoT.
4. Si eres el Desarrollador Senior: entrega bloques de código completos, limpios, comentados y listos para producción en el lenguaje solicitado (PHP PDO, TypeScript, React, Python, C++, SQL).
5. Si eres la Auditora de QA & Seguridad: revisa posibles fallas OWASP, provee suites de pruebas y matrices de casos de prueba con casos límite.
6. Si eres la Especialista en Rescate: realiza diagnósticos de viabilidad, planes semanales de rescate y esquemas de acreditación académica por adopción.
7. Finaliza con una sección clara titulada "💡 Recomendación Clave para tu Proyecto en TESCHI" con una acción concreta aplicable de inmediato.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
        });

        const reply = response.text || "Disculpa, no pude procesar la respuesta en este momento.";
        return res.json({ success: true, data: { respuesta: reply, agente: selectedProfile } });
      }

      // Fallback inteligente enriquecido según el agente seleccionado
      let fallbackText = "";

      if (currentAgent === 'arquitectura') {
        fallbackText = `### Asesoría de Arquitectura de Sistemas & Base de Datos
**${selectedProfile.nombre}** · ${selectedProfile.rol}

Para la arquitectura técnica de tu proyecto **"${proyecto?.nombre || 'Académico'}"**:

1. **Diseño de Base de Datos Relacional Normalizada (3FN):**
   - Separación rigurosa de entidades independientes (\`usuarios\`, \`proyectos\`, \`actividades\`, \`sensores_telemetria\`).
   - Ejemplo de esquema DDL recomendado para MySQL:
\`\`\`sql
-- Esquema relacional con llaves foráneas e índices optimizados
CREATE TABLE IF NOT EXISTS modulos_proyecto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proyecto_id INT NOT NULL,
  nombre_modulo VARCHAR(120) NOT NULL,
  estado ENUM('planeado', 'desarrollo', 'pruebas', 'terminado') DEFAULT 'planeado',
  porcentaje_avance DECIMAL(5,2) DEFAULT 0.00,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  INDEX idx_proyecto_modulo (proyecto_id, estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
\`\`\`

2. **Diagrama de Arquitectura en Capas:**
   - **Capa Cliente (Frontend):** React 18 SPA con Tailwind CSS y llamadas asíncronas vía Fetch API.
   - **Capa de Servicios (API):** Controladores RESTful con validación y contratos JSON.
   - **Capa de Persistencia:** MySQL / MariaDB con transacciones ACID para evitar inconsistencias.

💡 **Recomendación Clave para tu Proyecto en TESCHI:** En la memoria técnica para los revisores de 8vo/9no semestre, incluye siempre el diagrama Entidad-Relación y el Diagrama de Casos de Uso con sus actores principales (Alumno, Asesor Docente y Administrador).`;
      } else if (currentAgent === 'desarrollo') {
        fallbackText = `### Implementación de Código y Controladores
**${selectedProfile.nombre}** · ${selectedProfile.rol}

Aquí tienes la solución de código limpio y modular para tu requerimiento:

\`\`\`php
<?php
// api/guardar_avance.php - Controlador modular con PDO y sentencias preparadas
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['proyecto_id'], $input['porcentaje_terminado'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Faltan campos obligatorios"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE proyectos 
        SET porcentaje_terminado = :pct, 
            ultimo_commit = NOW() 
        WHERE id = :id
    ");
    $stmt->execute([
        ':pct' => min(100, max(0, floatval($input['porcentaje_terminado']))),
        ':id'  => intval($input['proyecto_id'])
    ]);

    echo json_encode([
        "success" => true,
        "mensaje" => "Porcentaje de terminado y timestamp actualizados exitosamente",
        "data" => ["proyecto_id" => $input['proyecto_id']]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error de ejecución: " . $e->getMessage()]);
}
\`\`\`

💡 **Recomendación Clave para tu Proyecto en TESCHI:** Maneja siempre los códigos de estado HTTP estándar (\`200 OK\`, \`400 Bad Request\`, \`500 Server Error\`). Los asesores docentes revisan en consola de desarrollador que las peticiones devuelvan respuestas estructuradas en JSON.`;
      } else if (currentAgent === 'qa_seguridad') {
        fallbackText = `### Auditoría de Calidad, Pruebas y Seguridad OWASP
**${selectedProfile.nombre}** · ${selectedProfile.rol}

He revisado los aspectos críticos para la acreditación de tu proyecto:

1. **Checklist de Seguridad Obligatorio (OWASP Top 10):**
   - ✅ **Inyección SQL:** Prevenida mediante sentencias preparadas con parámetros vinculados (\`PDO::prepare\`).
   - ✅ **XSS (Cross-Site Scripting):** Sanitización en inputs y escape en salida con React.
   - ✅ **Control de Acceso:** Validación de sesión activa y pertenencia del proyecto al usuario autenticado.
   - ✅ **Almacenamiento de Secretos:** Nunca almacenar claves de API en el código cliente del frontend.

2. **Matriz de Pruebas Unitarias Automatizadas (Jest / Vitest):**
\`\`\`typescript
import { describe, it, expect } from 'vitest';

describe('Validación de Porcentaje de Avance', () => {
  it('debe aceptar valores válidos entre 0 y 100', () => {
    const calcularAvance = (actividadesCompletadas: number, total: number) => 
      total > 0 ? Math.round((actividadesCompletadas / total) * 100) : 0;

    expect(calcularAvance(4, 5)).toBe(80);
    expect(calcularAvance(0, 5)).toBe(0);
    expect(calcularAvance(5, 5)).toBe(100);
  });
});
\`\`\`

💡 **Recomendación Clave para tu Proyecto en TESCHI:** En el Capítulo 4 de tu memoria técnica incluye una tabla con al menos 10 casos de prueba funcionales (entradas normales, entradas con error y respuestas esperadas) para respaldar la calidad de tu software ante el jurado.`;
      } else if (currentAgent === 'rescate_donacion') {
        fallbackText = `### Diagnóstico de Continuidad, Rescate y Donación
**${selectedProfile.nombre}** · ${selectedProfile.rol}

Como especialista en continuidad de proyectos estudiantiles del TESCHI:

1. **Regla Normativa de Inactividad:**
   - **Abandono Crítico:** Proyectos con **5 meses o más sin commits ni entregables**.
   - **En Riesgo:** Proyectos con 3 a 4 meses sin actividad reciente.
   - **Activos:** Menos de 3 meses de inactividad.

2. **Plan de Rescate Acelerado en 4 Semanas:**
   - **Semana 1 (Auditoría Forense):** Clonar repositorio, levantar base de datos en local, auditar dependencias rotas y definir porcentaje real terminado.
   - **Semana 2 (Refactorización del Núcleo):** Corregir controladores principales y asegurar persistencia funcional.
   - **Semana 3 (Implementación de Reingeniería):** Añadir las nuevas funcionalidades que pide la residencia.
   - **Semana 4 (Pruebas y Memoria Técnica):** Generar memoria técnica con la sección formal de "Aportaciones de Reingeniería".

💡 **Recomendación Clave para tu Proyecto en TESCHI:** Si adoptas este proyecto donado para tu titulación, redacta detalladamente en el Capítulo 3 qué parte construyó el autor original y cuáles son tus aportaciones exclusivas. Así el sínodo validará con honores tu residencia profesional.`;
      } else {
        // Metodología por defecto
        fallbackText = `### Asesoría Metodológica y Protocolo de Titulación TESCHI
**${selectedProfile.nombre}** · ${selectedProfile.rol}

Para asegurar que tu proyecto **"${proyecto?.nombre || 'Académico'}"** cumpla con los lineamientos oficiales:

1. **Estructura Oficial de la Memoria de Residencia Profesional:**
   - **Capítulo 1:** Generalidades del Proyecto (planteamiento del problema, justificación y objetivos SMART).
   - **Capítulo 2:** Marco Teórico y Referencial (estado del arte, normatividad y tecnologías utilizadas).
   - **Capítulo 3:** Metodología y Desarrollo (modelo Scrum, historias de usuario, diagramas de arquitectura y modelado de datos).
   - **Capítulo 4:** Resultados, Pruebas y Trabajo a Futuro (matriz de pruebas, capturas de pantalla y manual de usuario).

2. **Formulación de Objetivos:**
   - **Objetivo General:** Iniciar con verbo en infinitivo (Desarrollar, Implementar, Diseñar) + el qué + el cómo + el para qué.
   - **Objetivos Específicos:** 4 hitos secuenciales (Diagnosticar requerimientos, Diseñar la arquitectura, Programar los módulos, Validar con pruebas).

💡 **Recomendación Clave para tu Proyecto en TESCHI:** Asegúrate de que las fechas de tus entregables en el cronograma coincidan exactamente con las semanas del semestre académico registradas en tu formato oficial de residencia.`;
      }

      return res.json({ success: true, data: { respuesta: fallbackText, agente: selectedProfile } });
    } catch (error: any) {
      console.error("Error in student-assistant:", error);
      res.status(500).json({ success: false, error: error.message || "Error al procesar consulta" });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TESPROY Server running on port ${PORT}`);
  });
}

startServer();
