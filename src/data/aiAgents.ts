import { AgenteIATipo } from '../types';

export interface PromptRecomendado {
  titulo: string;
  descripcion: string;
  prompt: string;
  categoria: 'metodologia' | 'arquitectura' | 'codigo' | 'seguridad' | 'rescate';
}

export interface AgenteIAConfig {
  id: AgenteIATipo;
  numero: number;
  nombre: string;
  titulo: string;
  cargo: string;
  avatar: string;
  colorTema: {
    badge: string;
    bgBadge: string;
    border: string;
    glow: string;
    button: string;
    avatarBg: string;
    iconColor: string;
  };
  especialidad: string;
  descripcion: string;
  carrerasAfines: string[];
  habilidadesClave: string[];
  entregablesGenerables: string[];
  mensajeBienvenida: string;
  promptsRecomendados: PromptRecomendado[];
}

export const AGENTES_IA_IMPLEMENTACION: AgenteIAConfig[] = [
  {
    id: 'metodologia',
    numero: 1,
    nombre: 'Dr. Armando Flores V.',
    titulo: 'Asesor Metodológico & Titulación',
    cargo: 'Coordinador de Protocolos y Memoria Técnica TESCHI',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    colorTema: {
      badge: 'text-emerald-700 dark:text-emerald-300',
      bgBadge: 'bg-emerald-100 dark:bg-emerald-950/70',
      border: 'border-emerald-300 dark:border-emerald-800',
      glow: 'ring-emerald-500/30',
      button: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      avatarBg: 'bg-emerald-100 dark:bg-emerald-900',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    especialidad: 'Protocolo de Residencia Profesional, Rúbricas Oficiales y Estructura Capitular',
    descripcion: 'Especialista en metodología de investigación, congruencia de objetivos SMART, delimitación y cumplimiento de la rúbrica oficial de 7mo a 9no semestre para titulación directa.',
    carrerasAfines: [
      'Ing. en Sistemas Computacionales',
      'Ing. Mecatrónica',
      'Ing. Industrial',
      'Lic. en Administración',
      'Animación Digital (ADEV)',
      'Gastronomía'
    ],
    habilidadesClave: [
      'Estructura Capitular TESCHI (Capítulo 1 al 4)',
      'Objetivos SMART y Justificación Técnico-Económica',
      'Formato APA 7ma Edición e Índices',
      'Cronograma Gantt de Residencia Profesional',
      'Matriz de Congruencia Metodológica'
    ],
    entregablesGenerables: [
      'Esquema Completo del Capítulo 3: Metodología',
      'Matriz de Congruencia (Problema - Objetivos - Entregables)',
      'Cronograma de Trabajo por Hitos y Semanas',
      'Formato Oficial de Dictamen Previo'
    ],
    mensajeBienvenida: '¡Hola! Soy tu **Asesor Metodológico y de Titulación**. Te guiaré paso a paso para que tu proyecto cumpla rigurosamente con la **rúbrica institucional del TESCHI**, la estructura capitular de tu memoria técnica y los lineamientos de residencia profesional para que obtengas tu dictamen aprobatorio sin contratiempos.',
    promptsRecomendados: [
      {
        titulo: '📋 Estructurar Capítulo 3 (Metodología)',
        descripcion: 'Define el modelo metodológico (Scrum / Cascada / XP) y las fases de desarrollo.',
        prompt: 'Ayúdame a redactar y estructurar el Capítulo 3: Metodología y Desarrollo para mi proyecto, justificando el uso de Scrum y detallando los sprints con entregables verificables para los asesores del TESCHI.',
        categoria: 'metodologia'
      },
      {
        titulo: '🎯 Redactar Objetivos SMART y Justificación',
        descripcion: 'Formulación rigurosa del objetivo general y los 4 específicos.',
        prompt: 'Genera el objetivo general, 4 objetivos específicos medibles (SMART) y la justificación técnica, social y económica de mi proyecto para cumplir con los lineamientos del protocolo.',
        categoria: 'metodologia'
      },
      {
        titulo: '📊 Matriz de Congruencia Metodológica',
        descripcion: 'Alineación de problema, preguntas, hipótesis, variables e indicadores.',
        prompt: 'Crea la tabla de la Matriz de Congruencia Metodológica para este proyecto, relacionando el problema diagnosticado, los objetivos, las variables tecnológicas y los entregables esperados.',
        categoria: 'metodologia'
      },
      {
        titulo: '🎓 Criterios de la Rúbrica de Titulación',
        descripcion: 'Puntos críticos que evalúan los sínodos y docentes asesores.',
        prompt: '¿Cuáles son los 5 criterios obligatorios que revisa el comité revisor del TESCHI en 8vo y 9no semestre para aprobar una memoria de residencia profesional?',
        categoria: 'metodologia'
      }
    ]
  },
  {
    id: 'arquitectura',
    numero: 2,
    nombre: 'Ing. Roberto Soto M.',
    titulo: 'Arquitecto de Software & Hardware IoT',
    cargo: 'Especialista en Modelado de Sistemas y Sistemas Embebidos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    colorTema: {
      badge: 'text-blue-700 dark:text-blue-300',
      bgBadge: 'bg-blue-100 dark:bg-blue-950/70',
      border: 'border-blue-300 dark:border-blue-800',
      glow: 'ring-blue-500/30',
      button: 'bg-blue-700 hover:bg-blue-800 text-white',
      avatarBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    especialidad: 'Diseño de Base de Datos (3FN), Diagramas UML y Arquitectura IoT',
    descripcion: 'Diseño integral de arquitecturas desacopladas, esquemas relacionales normalizados, contratos RESTful y esquemas de hardware para ESP32/Arduino con sensores y telemetría.',
    carrerasAfines: [
      'Ing. en Sistemas Computacionales',
      'Ing. Mecatrónica',
      'Ing. Industrial'
    ],
    habilidadesClave: [
      'Normalización de Base de Datos (3FN, Índices, FK)',
      'Diagramas UML (Casos de Uso, Secuencia, Clases, Despliegue)',
      'Arquitectura MVC, Clean Architecture y Microservicios',
      'Protocolos IoT (MQTT, HTTP REST, WebSockets, I2C, SPI)',
      'Esquemáticos de Conexión ESP32 / Arduino / Sensores'
    ],
    entregablesGenerables: [
      'Script DDL de Base de Datos con Tablas y Relaciones',
      'Especificación de Arquitectura de Capas en Markdown',
      'Diagrama de Secuencia y Casos de Uso en PlantUML / Mermaid',
      'Contrato OpenAPI / Swagger de Endpoints'
    ],
    mensajeBienvenida: '¡Buen día! Soy tu **Arquitecto de Software & Hardware**. Te ayudo a modelar la base de datos normalizada, trazar los diagramas UML que te piden en los entregables de residencia y diseñar esquemas de comunicación estables entre microcontroladores, APIs y bases de datos.',
    promptsRecomendados: [
      {
        titulo: '🗄️ Diseñar Base de Datos Normalizada (3FN)',
        descripcion: 'Tablas, campos, llaves foráneas y tipos optimizados.',
        prompt: 'Diseña el esquema de base de datos relacional normalizado en 3ra Forma Normal (3FN) para mi proyecto, con sus tablas, llaves primarias/foráneas y los índices necesarios para alto rendimiento.',
        categoria: 'arquitectura'
      },
      {
        titulo: '📐 Diagramas UML (Casos de Uso y Secuencia)',
        descripcion: 'Modelado visual para la memoria técnica y entregables.',
        prompt: 'Genera en formato Mermaid o PlantUML los diagramas de Casos de Uso con actores y el Diagrama de Secuencia para el flujo principal de mi sistema.',
        categoria: 'arquitectura'
      },
      {
        titulo: '⚡ Circuito IoT & Protocolo MQTT / HTTP',
        descripcion: 'Conexión de sensores con ESP32 y envío de lecturas.',
        prompt: 'Diseña el diagrama de conexión hardware entre microcontrolador ESP32 y los sensores requeridos, especificando los pines GPIO, protocolo de comunicación (MQTT o HTTP POST) y el formato del payload JSON.',
        categoria: 'arquitectura'
      },
      {
        titulo: '🌐 Contrato de Endpoints API RESTful',
        descripcion: 'Rutas, métodos HTTP, cabeceras y respuestas esperadas.',
        prompt: 'Define el contrato de API RESTful para los endpoints principales de mi proyecto, incluyendo verbos HTTP (GET, POST, PUT, DELETE), parámetros, cabeceras y estructura JSON de respuestas exitosas y errores.',
        categoria: 'arquitectura'
      }
    ]
  },
  {
    id: 'desarrollo',
    numero: 3,
    nombre: 'Lic. Carlos Morales E.',
    titulo: 'Desarrollador Senior & Generador de Código',
    cargo: 'Lead Developer & Especialista en Implementación Multilenguaje',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    colorTema: {
      badge: 'text-purple-700 dark:text-purple-300',
      bgBadge: 'bg-purple-100 dark:bg-purple-950/70',
      border: 'border-purple-300 dark:border-purple-800',
      glow: 'ring-purple-500/30',
      button: 'bg-purple-700 hover:bg-purple-800 text-white',
      avatarBg: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    especialidad: 'Implementación de Código Funcional (TypeScript, React, Python, PHP, C++, SQL)',
    descripcion: 'Escritura directa de código limpio, seguro y modular: controladores backend, componentes interactivos de UI, scripts de ingestión de datos y firmware listo para cargar a placas.',
    carrerasAfines: [
      'Ing. en Sistemas Computacionales',
      'Animación Digital (ADEV)',
      'Ing. Mecatrónica'
    ],
    habilidadesClave: [
      'Full-Stack: React 18, TypeScript, Tailwind CSS',
      'Backend: PHP (PDO / XAMPP), Node.js, Express, Python FastAPI',
      'Bases de Datos: MySQL / MariaDB, PostgreSQL, SQLite',
      'Embebidos: C++ Arduino Core, MicroPython, ESP-IDF',
      'Control de Versiones: Git, Commits Semánticos y Pull Requests'
    ],
    entregablesGenerables: [
      'Scripts PHP con PDO y Manejo de Errores Try-Catch',
      'Componentes React Completos con Hooks y Estados',
      'Firmware en C++ para ESP32 con WiFiManager y Reconexión',
      'Consultas SQL Avanzadas con JOINs y Agregaciones'
    ],
    mensajeBienvenida: '¡Qué tal! Soy tu **Desarrollador Senior & Generador de Código**. Cuéntame qué parte de tu sistema necesitas implementar: ¿el controlador PHP con PDO, el componente en React, el script en Python o el firmware en C++ para tu ESP32? Te escribiré el código completo, comentado y listo para usar.',
    promptsRecomendados: [
      {
        titulo: '💻 Controlador PHP PDO con JSON',
        descripcion: 'API backend segura para recibir y guardar datos en MySQL.',
        prompt: 'Escribe el archivo PHP completo con conexión PDO a MySQL que reciba datos en formato JSON desde el frontend, valide los campos requeridos, use sentencias preparadas y devuelva respuestas estándar HTTP.',
        categoria: 'codigo'
      },
      {
        titulo: '⚛️ Componente React + TypeScript',
        descripcion: 'Vista interactiva con estados, validación y estilos Tailwind.',
        prompt: 'Crea un componente modular en React con TypeScript y Tailwind CSS para capturar y visualizar los datos principales de este proyecto, con validación de inputs y retroalimentación de carga.',
        categoria: 'codigo'
      },
      {
        titulo: '🤖 Firmware en C++ para ESP32 / Arduino',
        descripcion: 'Lectura de sensores, reconexión automática y envío a servidor.',
        prompt: 'Escribe el código fuente en C++ para microcontrolador ESP32 que configure la red WiFi, lea los sensores analógicos y digitales periódicamente cada 5 segundos y envíe los datos vía HTTP POST a la API.',
        categoria: 'codigo'
      },
      {
        titulo: '🔍 Consultas SQL Complejas y Vistas',
        descripcion: 'Métricas, conteos agrupados y reportes para el proyecto.',
        prompt: 'Escribe las consultas SQL con INNER JOIN, GROUP BY y funciones de fecha necesarias para generar el reporte de métricas y resumen de avances para este proyecto.',
        categoria: 'codigo'
      }
    ]
  },
  {
    id: 'qa_seguridad',
    numero: 4,
    nombre: 'Dra. Maricela Rivas S.',
    titulo: 'Auditora de Calidad, Testing & Seguridad',
    cargo: 'Especialista en Pruebas de Software y Ciberseguridad OWASP',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    colorTema: {
      badge: 'text-amber-700 dark:text-amber-300',
      bgBadge: 'bg-amber-100 dark:bg-amber-950/70',
      border: 'border-amber-300 dark:border-amber-800',
      glow: 'ring-amber-500/30',
      button: 'bg-amber-700 hover:bg-amber-800 text-white',
      avatarBg: 'bg-amber-100 dark:bg-amber-900',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    especialidad: 'Auditoría de Vulnerabilidades OWASP, Pruebas Unitarias y Código Limpio',
    descripcion: 'Auditoría preventiva de fallas de seguridad (SQL Injection, XSS, sanitización, manejo de tokens), suites de pruebas automatizadas y aseguramiento de buenas prácticas SOLID.',
    carrerasAfines: [
      'Ing. en Sistemas Computacionales',
      'Lic. en Administración',
      'Ing. Industrial'
    ],
    habilidadesClave: [
      'OWASP Top 10 (SQL Injection, XSS, Broken Auth, CSRF)',
      'Testing: Jest, React Testing Library, PyTest, PHPUnit',
      'Sanitización de Datos y Validación de Entradas',
      'Principios SOLID, DRY, Clean Code y Refactorización',
      'Optimización de Tiempos de Respuesta y Perfilado de Memoria'
    ],
    entregablesGenerables: [
      'Matriz de Pruebas Funcionales y de Rendimiento',
      'Reporte de Auditoría de Vulnerabilidades con Correcciones',
      'Suite de Pruebas Unitarias Automatizadas',
      'Checklist de Despliegue Seguro para Acreditación'
    ],
    mensajeBienvenida: '¡Hola! Soy tu **Auditora de Calidad, Testing & Seguridad**. Revisaré tu código para garantizar que esté libre de vulnerabilidades críticas de seguridad, cumpla con estándares de calidad de software y cuente con la batería de pruebas requerida para obtener la máxima nota en tu dictamen.',
    promptsRecomendados: [
      {
        titulo: '🛡️ Auditoría de Seguridad OWASP',
        descripcion: 'Detección y corrección de inyecciones SQL, XSS y credenciales expuestas.',
        prompt: 'Realiza una auditoría de seguridad a este proyecto: analiza riesgos de SQL Injection, cross-site scripting (XSS), sanitización de entradas y almacenamiento seguro de contraseñas con bcrypt.',
        categoria: 'seguridad'
      },
      {
        titulo: '🧪 Generar Suite de Pruebas Unitarias',
        descripcion: 'Casos de prueba con Jest / PyTest para validar la lógica principal.',
        prompt: 'Genera una suite de pruebas unitarias automatizadas con Jest o PyTest que cubra los casos de éxito, casos límite y manejo de errores para las funciones críticas de este proyecto.',
        categoria: 'seguridad'
      },
      {
        titulo: '📋 Matriz de Pruebas para Memoria de Residencia',
        descripcion: 'Tabla formal de pruebas solicitada en el Capítulo 4.',
        prompt: 'Diseña la Matriz de Pruebas de Software en formato de tabla para el Capítulo 4 de la memoria de residencia, con Caso de Prueba, Entrada, Resultado Esperado, Resultado Obtenido y Estatus (Aprobado/Fallido).',
        categoria: 'seguridad'
      },
      {
        titulo: '⚡ Optimización y Refactorización SOLID',
        descripcion: 'Mejora de rendimiento, legibilidad y reducción de deuda técnica.',
        prompt: 'Revisa y refactoriza la estructura de mi proyecto aplicando principios SOLID (especialmente Responsabilidad Única y Abierto/Cerrado) para hacerlo más mantenible y veloz.',
        categoria: 'seguridad'
      }
    ]
  },
  {
    id: 'rescate_donacion',
    numero: 5,
    nombre: 'Mtra. Yolanda González F.',
    titulo: 'Especialista en Diagnóstico, Rescate & Donación',
    cargo: 'Comisionada de Continuidad y Adopción de Proyectos TESCHI',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    colorTema: {
      badge: 'text-rose-700 dark:text-rose-300',
      bgBadge: 'bg-rose-100 dark:bg-rose-950/70',
      border: 'border-rose-300 dark:border-rose-800',
      glow: 'ring-rose-500/30',
      button: 'bg-rose-700 hover:bg-rose-800 text-white',
      avatarBg: 'bg-rose-100 dark:bg-rose-900',
      iconColor: 'text-rose-600 dark:text-rose-400'
    },
    especialidad: 'Auditoría Forense de Abandono (Regla de 5+ Meses), Rescate y Adopción',
    descripcion: 'Diagnóstico técnico del estado de avance real (% Terminado), cálculo de deuda técnica, planes de rescate acelerado de 4 semanas y emparejamiento con alumnos de 7mo a 9no semestre para titulación.',
    carrerasAfines: [
      'Ing. en Sistemas Computacionales',
      'Ing. Mecatrónica',
      'Ing. Industrial',
      'Animación Digital (ADEV)',
      'Lic. en Administración'
    ],
    habilidadesClave: [
      'Auditoría Forense de Repositorios Inactivos',
      'Regla Institucional de Abandono (5+ Meses de Inactividad)',
      'Estimación de Esfuerzo de Rescate y % de Avance Real',
      'Plan de Reingeniería y Transición para Adopción',
      'Emparejamiento de Habilidades de Alumnos de 7°-9° Semestre'
    ],
    entregablesGenerables: [
      'Dictamen Forense de Abandono y Diagnóstico de Estado',
      'Plan de Rescate y Reactivación en 4 Semanas',
      'Convenio de Donación Voluntaria y Traspaso de Derechos',
      'Capítulo de Reingeniería y Nuevas Aportaciones para la Memoria'
    ],
    mensajeBienvenida: '¡Hola! Soy tu **Especialista en Diagnóstico, Rescate y Donación**. Mi misión es evitar que el esfuerzo de los alumnos se pierda. Evalúo proyectos inactivos mediante la regla institucional de 5 meses, calculo el porcentaje real de avance y diseño planes claros para reactivarlos o prepararlos para su adopción por compañeros de semestres avanzados.',
    promptsRecomendados: [
      {
        titulo: '🔍 Diagnóstico Forense y Deuda Técnica',
        descripcion: 'Evaluación del estado de terminación real y componentes rotos.',
        prompt: 'Realiza un diagnóstico forense a profundidad de este proyecto: determina qué módulos están funcionales, qué porcentaje real de terminación tiene y qué dependencias o código están obsoletos.',
        categoria: 'rescate'
      },
      {
        titulo: '🚀 Plan de Rescate Acelerado (4 Semanas)',
        descripcion: 'Cronograma intensivo para reactivar y terminar el proyecto.',
        prompt: 'Diseña un Plan de Rescate Acelerado estructurado en 4 semanas para que un equipo nuevo tome este proyecto en riesgo, resuelva los bloqueos críticos y lo deje listo para entrega.',
        categoria: 'rescate'
      },
      {
        titulo: '🤝 Protocolo de Adopción y Titulación',
        descripcion: 'Requisitos para que alumnos de 7mo a 9no semestre adopten un proyecto.',
        prompt: '¿Cuáles son los pasos y documentación académica requerida para que un alumno de 8vo o 9no semestre adopte formalmente un proyecto donado y se titule acreditando su residencia con él?',
        categoria: 'rescate'
      },
      {
        titulo: '📝 Redacción de Reingeniería en la Memoria',
        descripcion: 'Cómo justificar el trabajo realizado sobre un proyecto heredado.',
        prompt: 'Redacta la sección de "Antecedentes y Justificación de la Reingeniería" para la memoria de titulación, explicando con rigor académico qué aportó el equipo original y cuáles son las nuevas aportaciones del equipo que adoptó el proyecto.',
        categoria: 'rescate'
      }
    ]
  }
];
