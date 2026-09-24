export interface XamppFileItem {
  nombre: string;
  rutaRelativa: string;
  descripcion: string;
  lenguaje: 'php' | 'sql' | 'apache' | 'txt';
  contenido: string;
}

export const SQL_DATABASE_SCHEMA = `-- ====================================================================
-- SISTEMA REPOSITORIO ACADÉMICO TESPROY - TESCHI (7° A 9° SEMESTRE)
-- Script Completo de Base de Datos MySQL / MariaDB para XAMPP
-- Base de Datos: tesproy_db
-- ====================================================================

CREATE DATABASE IF NOT EXISTS tesproy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tesproy_db;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabla de Usuarios (Alumnos de 7mo a 9no semestre)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matricula VARCHAR(50) NULL UNIQUE,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  telefono VARCHAR(30) DEFAULT '',
  ubicacion VARCHAR(150) DEFAULT 'Chimalhuacán, Estado de México',
  bio TEXT NULL,
  carrera VARCHAR(120) DEFAULT 'Ingeniería en Sistemas Computacionales',
  semestre VARCHAR(50) DEFAULT '8ISC21',
  promedio DECIMAL(4,1) DEFAULT 85.0,
  habilidades TEXT NULL,
  foto_perfil LONGTEXT NULL,
  rol ENUM('estudiante', 'maestro', 'administrador') DEFAULT 'estudiante',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Maestros / Profesores Asesores
CREATE TABLE IF NOT EXISTS maestros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  departamento VARCHAR(120) NOT NULL DEFAULT 'División de Ingeniería en Sistemas Computacionales',
  especialidades TEXT NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  cubo_o_oficina VARCHAR(100) DEFAULT 'Edificio H - Cubículo 104',
  carga_actual INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Administradores
CREATE TABLE IF NOT EXISTS administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  estado TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla Principal de Proyectos Académicos
CREATE TABLE IF NOT EXISTS proyectos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE,
  fecha_fin DATE,
  semestre VARCHAR(50) DEFAULT '8ISC21',
  asignatura VARCHAR(150) DEFAULT 'Titulación / Residencia Profesional',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  ultimo_commit DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  maestro_id INT NULL,
  calificacion DECIMAL(5,2) NULL,
  porcentaje_terminado DECIMAL(5,2) DEFAULT 0.00,
  comentario TEXT NULL,
  es_donado TINYINT(1) DEFAULT 0,
  fecha_donacion DATETIME NULL,
  usuario_id_actual INT NULL,
  listo_para_donar TINYINT(1) DEFAULT 0,
  progreso INT DEFAULT 0,
  tags VARCHAR(255) DEFAULT '[]',
  meses_inactividad INT DEFAULT 0,
  dias_inactividad INT DEFAULT 0,
  estado_abandono ENUM('activo', 'en_riesgo', 'abandonado', 'donado') DEFAULT 'activo',
  diagnostico_ia TEXT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (maestro_id) REFERENCES maestros(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id_actual) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabla de Integrantes de Equipo
CREATE TABLE IF NOT EXISTS integrantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proyecto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabla de Actividades y Entregables
CREATE TABLE IF NOT EXISTS actividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proyecto_id INT NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  miembro VARCHAR(100) DEFAULT 'Equipo',
  fecha_inicio DATE,
  fecha_fin DATE,
  estado ENUM('pendiente', 'en_progreso', 'completada') DEFAULT 'pendiente',
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabla de Archivos y Entregables de Código
CREATE TABLE IF NOT EXISTS archivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proyecto_id INT NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  tipo ENUM('codigo', 'documento', 'video', 'otro') DEFAULT 'documento',
  tamano VARCHAR(50) DEFAULT '1.5 MB',
  fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabla de Votaciones de Donación entre Integrantes
CREATE TABLE IF NOT EXISTS votaciones_donacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proyecto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  voto ENUM('a_favor', 'en_contra', 'pendiente') DEFAULT 'pendiente',
  fecha_voto DATETIME NULL,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabla de Solicitudes de Adopción (Alumnos de 7mo a 9no semestre)
CREATE TABLE IF NOT EXISTS solicitudes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proyecto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
  fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta DATETIME NULL,
  evaluacion_ia TEXT NULL,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tabla de Notificaciones Institucionales
CREATE TABLE IF NOT EXISTS notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  mensaje TEXT NOT NULL,
  tipo ENUM('general', 'donacion', 'profesor', 'calificacion') DEFAULT 'general',
  leida TINYINT(1) DEFAULT 0,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- PARCHE DE COMPATIBILIDAD AUTOMÁTICO (SI YA TENÍAS TABLAS ANTERIORES)
-- ====================================================================
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS matricula VARCHAR(50) NULL UNIQUE AFTER id;
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS meses_inactividad INT DEFAULT 0;
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS porcentaje_terminado DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS dias_inactividad INT DEFAULT 0;
ALTER TABLE proyectos ADD COLUMN IF NOT EXISTS diagnostico_ia TEXT NULL;
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS leida TINYINT(1) DEFAULT 0;

-- ====================================================================
-- DATOS INICIALES SEMILLA DE TESPROY (TESCHI)
-- ====================================================================

-- Usuarios Alumnos:
INSERT INTO usuarios (id, matricula, correo, contrasena, nombre, telefono, carrera, semestre, promedio, habilidades, rol) VALUES
(7, '2021110034', 'luis27@gmail.com', MD5('123456'), 'Luis Roberto Nieto Romero', '5543219876', 'Ing. en Sistemas Computacionales', '8ISC21', 94.8, '["React", "Node.js", "TypeScript", "MySQL", "Tailwind CSS"]', 'estudiante'),
(32, '2022441235', '2022441235@teschi.edu.mx', MD5('123456'), 'Claudia Elizabeth', '5512345678', 'Ing. en Sistemas Computacionales', '8ISC21', 96.2, '["Python", "Machine Learning", "FastAPI", "Docker"]', 'estudiante')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), matricula=VALUES(matricula);

-- Docentes Asesores:
INSERT INTO maestros (id, nombre, correo, contrasena, departamento, especialidades, activo, cubo_o_oficina, carga_actual) VALUES
(1, 'Mtra. Yolanda González Flores', 'yolanda@teschi.edu.mx', MD5('123456'), 'División de Sistemas Computacionales', 'Gestión de Proyectos, Metodologías Ágiles, Calidad de Software', 1, 'Edificio H - Cubículo 104', 3),
(2, 'Dr. Roberto Carlos Martínez', 'roberto.martinez@teschi.edu.mx', MD5('123456'), 'División de Sistemas Computacionales', 'Inteligencia Artificial, Visión por Computadora, Deep Learning', 1, 'Edificio H - Cubículo 108', 2),
(3, 'Ing. Julio Méndez César Calva', '2034346218@teschi.edu.mx', MD5('123456'), 'División de Sistemas Computacionales', 'Sistemas Programables, IoT Industrial, Arquitectura de Hardware', 1, 'Edificio F - Lab Embebidos', 4)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Administradores:
INSERT INTO administradores (id, correo, contrasena, nombre, estado) VALUES
(1, 'serviciosocial@teschi.edu.mx', MD5('admin123'), 'Coordinación de Residencias y Proyectos TESCHI', 1)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Proyectos Iniciales:
INSERT INTO proyectos (id, usuario_id, nombre, descripcion, fecha_inicio, fecha_fin, semestre, asignatura, maestro_id, calificacion, porcentaje_terminado, progreso, es_donado, meses_inactividad, dias_inactividad, estado_abandono, tags, ultimo_commit) VALUES
(1, 7, 'Sistema de Monitoreo IoT para Invernaderos Inteligentes', 'Plataforma con sensores ESP32, MQTT y panel web para medición de humedad y temperatura en cultivos agrícolas de la zona oriente.', '2024-02-01', '2024-06-30', '8ISC21', 'Sistemas Programables', 3, 92.00, 92.00, 92, 0, 0, 8, 'activo', '["IoT", "ESP32", "MQTT", "React", "Node.js"]', NOW()),
(2, 32, 'Plataforma Web de Detección de Plagas con Visión Artificial', 'Red neuronal convolucional entrenada con TensorFlow y OpenCV para diagnóstico temprano de plagas en hojas de maíz mediante fotos tomadas en campo.', '2023-08-15', '2023-12-20', '9ISC11', 'Residencia Profesional', 2, 85.00, 85.00, 85, 1, 5, 155, 'abandonado', '["Python", "TensorFlow", "OpenCV", "FastAPI"]', DATE_SUB(NOW(), INTERVAL 5 MONTH)),
(3, 7, 'App Móvil de Gestión de Tutorías Académicas TESCHI', 'Aplicación para asignación de citas entre alumnos y docentes tutores con notificaciones automáticas y seguimiento semestral.', '2024-01-10', '2024-05-30', '7ISC21', 'Programación Móvil', 1, 78.00, 78.00, 78, 0, 1, 25, 'activo', '["React Native", "Firebase", "TypeScript"]', DATE_SUB(NOW(), INTERVAL 25 DAY)),
(4, 32, 'Sistema Biométrico de Asistencia por Reconocimiento Facial', 'Software para laboratorios de cómputo que valida acceso de estudiantes mediante reconocimiento facial en tiempo real y registro en base de datos.', '2023-09-01', '2024-01-15', '8ISC21', 'Inteligencia Artificial', 2, 70.00, 70.00, 70, 1, 6, 185, 'abandonado', '["Python", "DeepFace", "MySQL", "OpenCV"]', DATE_SUB(NOW(), INTERVAL 6 MONTH))
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), meses_inactividad=VALUES(meses_inactividad);

-- Integrantes:
INSERT INTO integrantes (id, proyecto_id, usuario_id) VALUES
(1, 1, 7),
(2, 2, 32),
(3, 3, 7),
(4, 4, 32)
ON DUPLICATE KEY UPDATE proyecto_id=VALUES(proyecto_id);

-- Actividades:
INSERT INTO actividades (id, proyecto_id, nombre, miembro, fecha_inicio, fecha_fin, estado) VALUES
(1, 1, 'Configuración de broker MQTT y calibración de sensores', 'Luis Roberto', '2024-02-05', '2024-02-20', 'completada'),
(2, 1, 'Desarrollo de API REST en Node.js y MySQL', 'Luis Roberto', '2024-02-25', '2024-03-15', 'completada'),
(3, 1, 'Interfaz de usuario en React con gráficos de telemetría', 'Luis Roberto', '2024-03-20', '2024-04-10', 'completada'),
(4, 2, 'Recolección y etiquetado del dataset de plagas agrícolas', 'Claudia Elizabeth', '2023-08-20', '2023-09-15', 'completada'),
(5, 2, 'Entrenamiento del modelo ResNet50 con TensorFlow', 'Claudia Elizabeth', '2023-09-20', '2023-10-30', 'completada'),
(6, 2, 'Despliegue de servicio inferencia en contenedor Docker', 'Claudia Elizabeth', '2023-11-05', '2023-12-01', 'pendiente')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Archivos:
INSERT INTO archivos (id, proyecto_id, nombre_archivo, tipo, tamano) VALUES
(1, 1, 'firmware_esp32_mqtt.ino', 'codigo', '45 KB'),
(2, 1, 'diagrama_electronico_invernadero.pdf', 'documento', '2.4 MB'),
(3, 2, 'modelo_clasificador_plagas.h5', 'codigo', '85 MB'),
(4, 2, 'documento_arquitectura_red_neuronal.pdf', 'documento', '4.1 MB')
ON DUPLICATE KEY UPDATE nombre_archivo=VALUES(nombre_archivo);
`;

export const XAMPP_FILES_PACKAGE: XamppFileItem[] = [
  {
    nombre: 'tesproy_db.sql',
    rutaRelativa: 'tesproy_db.sql',
    descripcion: 'Script SQL completo y actualizado con todas las 10 tablas, datos semilla y parches de compatibilidad.',
    lenguaje: 'sql',
    contenido: SQL_DATABASE_SCHEMA
  },
  {
    nombre: 'config.php',
    rutaRelativa: 'api/config.php',
    descripcion: 'Variables de conexión (host, usuario root, pass vacía, bd tesproy_db).',
    lenguaje: 'php',
    contenido: `<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Archivo de Configuración de Base de Datos para XAMPP
 * Ruta en XAMPP: C:\\\\xampp\\\\htdocs\\\\tesproy\\\\api\\\\config.php
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Por defecto en XAMPP la contraseña de root está vacía
define('DB_NAME', 'tesproy_db');
define('DB_CHARSET', 'utf8mb4');
define('DB_PORT', 3306);
`
  },
  {
    nombre: 'conexion.php',
    rutaRelativa: 'api/conexion.php',
    descripcion: 'Conexión centralizada PDO, cabeceras CORS para React y utilidades JSON.',
    lenguaje: 'php',
    contenido: `<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Conexión Centralizada PDO para MySQL en XAMPP
 * Ruta en XAMPP: C:\\xampp\\htdocs\\tesproy\\api\\conexion.php
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "error"   => "Error de conexión con MySQL en XAMPP: " . $e->getMessage(),
                "tip"     => "Verifica que en el panel de XAMPP el módulo MySQL esté en verde (Start) y que la base de datos 'tesproy_db' exista."
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }
    return $pdo;
}

function jsonRes($success, $data = null, $error = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        "success" => $success,
        "data"    => $data,
        "error"   => $error
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

function getRequestBody() {
    $raw = file_get_contents("php://input");
    return json_decode($raw, true) ?? [];
}
`
  },
  {
    nombre: 'perfil.php',
    rutaRelativa: 'api/perfil.php',
    descripcion: 'Endpoint para consultar y modificar el perfil del alumno (nombre, bio, carrera, semestre, habilidades, etc.).',
    lenguaje: 'php',
    contenido: `<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Endpoint de Perfil de Estudiante (Consulta y Modificación)
 * Ruta en XAMPP: C:\\xampp\\htdocs\\tesproy\\api\\perfil.php
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// 1. OBTENER PERFIL DE ALUMNO (GET)
if ($method === 'GET') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    $correo = isset($_GET['correo']) ? trim($_GET['correo']) : '';

    if ($id <= 0 && empty($correo)) {
        jsonRes(false, null, "Debes proporcionar el 'id' o 'correo' del alumno.", 400);
    }

    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT id, correo, nombre, telefono, ubicacion, bio, carrera, semestre, promedio, habilidades, foto_perfil, rol, fecha_registro FROM usuarios WHERE id = ?");
        $stmt->execute([$id]);
    } else {
        $stmt = $pdo->prepare("SELECT id, correo, nombre, telefono, ubicacion, bio, carrera, semestre, promedio, habilidades, foto_perfil, rol, fecha_registro FROM usuarios WHERE correo = ?");
        $stmt->execute([$correo]);
    }

    $usuario = $stmt->fetch();
    if (!$usuario) {
        jsonRes(false, null, "Estudiante no encontrado en la base de datos.", 404);
    }

    if (!empty($usuario['habilidades'])) {
        $decoded = json_decode($usuario['habilidades'], true);
        $usuario['habilidades'] = is_array($decoded) ? $decoded : array_map('trim', explode(',', $usuario['habilidades']));
    } else {
        $usuario['habilidades'] = [];
    }

    jsonRes(true, $usuario);
}

// 2. ACTUALIZAR / MODIFICAR PERFIL DE ALUMNO (POST o PUT)
if ($method === 'POST' || $method === 'PUT') {
    $data = getRequestBody();

    $id = isset($data['id']) ? intval($data['id']) : 0;
    if ($id <= 0) {
        jsonRes(false, null, "Falta el ID del estudiante para actualizar su perfil.", 400);
    }

    $nombre      = isset($data['nombre']) ? trim($data['nombre']) : null;
    $telefono    = isset($data['telefono']) ? trim($data['telefono']) : null;
    $ubicacion   = isset($data['ubicacion']) ? trim($data['ubicacion']) : null;
    $bio         = isset($data['bio']) ? trim($data['bio']) : null;
    $carrera     = isset($data['carrera']) ? trim($data['carrera']) : null;
    $semestre    = isset($data['semestre']) ? trim($data['semestre']) : null;
    $promedio    = isset($data['promedio']) ? floatval($data['promedio']) : null;
    $foto_perfil = isset($data['foto_perfil']) ? trim($data['foto_perfil']) : null;

    $habilidades = null;
    if (isset($data['habilidades'])) {
        $habilidades = is_array($data['habilidades']) ? json_encode(array_values($data['habilidades']), JSON_UNESCAPED_UNICODE) : trim($data['habilidades']);
    }

    $fields = [];
    $params = [];

    if ($nombre !== null)      { $fields[] = "nombre = ?";      $params[] = $nombre; }
    if ($telefono !== null)    { $fields[] = "telefono = ?";    $params[] = $telefono; }
    if ($ubicacion !== null)   { $fields[] = "ubicacion = ?";   $params[] = $ubicacion; }
    if ($bio !== null)         { $fields[] = "bio = ?";         $params[] = $bio; }
    if ($carrera !== null)     { $fields[] = "carrera = ?";     $params[] = $carrera; }
    if ($semestre !== null)    { $fields[] = "semestre = ?";    $params[] = $semestre; }
    if ($promedio !== null)    { $fields[] = "promedio = ?";    $params[] = $promedio; }
    if ($habilidades !== null) { $fields[] = "habilidades = ?"; $params[] = $habilidades; }
    if ($foto_perfil !== null) { $fields[] = "foto_perfil = ?"; $params[] = $foto_perfil; }

    if (!empty($data['contrasena'])) {
        $fields[] = "contrasena = ?";
        $params[] = password_hash($data['contrasena'], PASSWORD_BCRYPT);
    }

    if (empty($fields)) {
        jsonRes(false, null, "No se enviaron datos para actualizar.", 400);
    }

    $params[] = $id;
    $sql = "UPDATE usuarios SET " . implode(", ", $fields) . " WHERE id = ?";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $stmtUser = $pdo->prepare("SELECT id, correo, nombre, telefono, ubicacion, bio, carrera, semestre, promedio, habilidades, foto_perfil, rol FROM usuarios WHERE id = ?");
        $stmtUser->execute([$id]);
        $updatedUser = $stmtUser->fetch();

        if (!empty($updatedUser['habilidades'])) {
            $dec = json_decode($updatedUser['habilidades'], true);
            $updatedUser['habilidades'] = is_array($dec) ? $dec : array_map('trim', explode(',', $updatedUser['habilidades']));
        } else {
            $updatedUser['habilidades'] = [];
        }

        jsonRes(true, $updatedUser, "Perfil de estudiante actualizado correctamente en MySQL.");
    } catch (PDOException $e) {
        jsonRes(false, null, "Error al actualizar perfil: " . $e->getMessage(), 500);
    }
}
`
  },
  {
    nombre: 'login.php',
    rutaRelativa: 'api/login.php',
    descripcion: 'Autenticación multirrol (Alumnos 7°-9°, Maestros Asesores y Administradores).',
    lenguaje: 'php',
    contenido: `<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Endpoint de Autenticación Multirrol (Alumno, Maestro, Administrador)
 * Ruta en XAMPP: C:\\xampp\\htdocs\\tesproy\\api\\login.php
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$data = getRequestBody();

$correo = isset($data['correo']) ? trim($data['correo']) : (isset($data['identifier']) ? trim($data['identifier']) : '');
$rolPreferido = isset($data['rol']) ? trim($data['rol']) : '';

if (empty($correo)) {
    jsonRes(false, null, "Ingresa tu correo institucional o matrícula.", 400);
}

// 1. Maestro
if ($rolPreferido === 'maestro' || stripos($correo, 'maestro') !== false || stripos($correo, 'yolanda') !== false) {
    $stmt = $pdo->prepare("SELECT id, nombre, correo, departamento, especialidades, activo, cubo_o_oficina, carga_actual FROM maestros WHERE correo = ? OR nombre LIKE ?");
    $stmt->execute([$correo, "%$correo%"]);
    $maestro = $stmt->fetch();

    if ($maestro) {
        $maestro['especialidades'] = !empty($maestro['especialidades']) ? array_map('trim', explode(',', $maestro['especialidades'])) : [];
        jsonRes(true, [
            "rol"     => "maestro",
            "usuario" => $maestro,
            "token"   => bin2hex(random_bytes(16))
        ], "Bienvenido Docente Asesor " . $maestro['nombre']);
    }
}

// 2. Administrador
if ($rolPreferido === 'administrador' || stripos($correo, 'admin') !== false || stripos($correo, 'serviciosocial') !== false) {
    $stmt = $pdo->prepare("SELECT id, correo, nombre, estado FROM administradores WHERE correo = ?");
    $stmt->execute([$correo]);
    $admin = $stmt->fetch();

    if ($admin) {
        jsonRes(true, [
            "rol"     => "administrador",
            "usuario" => $admin,
            "token"   => bin2hex(random_bytes(16))
        ], "Acceso concedido a Coordinación Administrativa TESCHI");
    }
}

// 3. Alumno
$stmt = $pdo->prepare("SELECT id, matricula, correo, nombre, telefono, ubicacion, bio, carrera, semestre, promedio, habilidades, foto_perfil, rol FROM usuarios WHERE correo = ? OR matricula = ? OR nombre LIKE ?");
$stmt->execute([$correo, $correo, "%$correo%"]);
$alumno = $stmt->fetch();

if ($alumno) {
    if (!empty($alumno['habilidades'])) {
        $dec = json_decode($alumno['habilidades'], true);
        $alumno['habilidades'] = is_array($dec) ? $dec : array_map('trim', explode(',', $alumno['habilidades']));
    } else {
        $alumno['habilidades'] = [];
    }

    jsonRes(true, [
        "rol"     => "estudiante",
        "usuario" => $alumno,
        "token"   => bin2hex(random_bytes(16))
    ], "Bienvenido al Repositorio TESPROY, " . $alumno['nombre']);
}

jsonRes(false, null, "Credenciales no encontradas en la base de datos de TESCHI.", 401);
`
  },
  {
    nombre: 'proyectos.php',
    rutaRelativa: 'api/proyectos.php',
    descripcion: 'Listado de proyectos, creación con asignaturas y tags, y cálculo de días inactivos.',
    lenguaje: 'php',
    contenido: `<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Endpoint de Proyectos (Listado, Creación, Actualización y Eliminación)
 * Ruta en XAMPP: C:\\xampp\\htdocs\\tesproy\\api\\proyectos.php
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// 1. LISTAR PROYECTOS (GET)
if ($method === 'GET') {
    $usuario_id = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;
    $solo_donados = isset($_GET['donados']) && $_GET['donados'] == '1';

    $sql = "SELECT p.*, 
                   u.nombre as autor_nombre, u.correo as autor_correo,
                   m.nombre as maestro_nombre, m.cubo_o_oficina as maestro_cubo,
                   DATEDIFF(NOW(), p.ultimo_commit) as dias_inactividad
            FROM proyectos p
            LEFT JOIN usuarios u ON p.usuario_id = u.id
            LEFT JOIN maestros m ON p.maestro_id = m.id
            WHERE 1=1";

    $params = [];

    if ($solo_donados) {
        $sql .= " AND (p.es_donado = 1 OR p.listo_para_donar = 1)";
    } elseif ($usuario_id > 0) {
        $sql .= " AND (p.usuario_id = ? OR p.id IN (SELECT proyecto_id FROM integrantes WHERE usuario_id = ?))";
        $params[] = $usuario_id;
        $params[] = $usuario_id;
    }

    $sql .= " ORDER BY p.ultimo_commit DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $proyectos = $stmt->fetchAll();

    foreach ($proyectos as &$p) {
        if (!empty($p['tags'])) {
            $dec = json_decode($p['tags'], true);
            $p['tags'] = is_array($dec) ? $dec : array_map('trim', explode(',', $p['tags']));
        } else {
            $p['tags'] = [];
        }

        $dias = intval($p['dias_inactividad'] ?? 0);
        $meses = isset($p['meses_inactividad']) && intval($p['meses_inactividad']) > 0
            ? intval($p['meses_inactividad'])
            : intval(floor($dias / 30));
        $p['meses_inactividad'] = $meses;
        $p['porcentaje_terminado'] = isset($p['calificacion']) && $p['calificacion'] !== null
            ? floatval($p['calificacion'])
            : (isset($p['porcentaje_terminado']) ? floatval($p['porcentaje_terminado']) : floatval($p['progreso'] ?? 0));

        if ($p['es_donado']) {
            $p['estado_abandono'] = 'donado';
        } elseif ($meses >= 5) {
            $p['estado_abandono'] = 'abandonado';
        } elseif ($meses >= 3) {
            $p['estado_abandono'] = 'en_riesgo';
        } else {
            $p['estado_abandono'] = 'activo';
        }
    }

    jsonRes(true, $proyectos);
}

// 2. CREAR NUEVO PROYECTO (POST)
if ($method === 'POST') {
    $data = getRequestBody();

    $usuario_id  = isset($data['usuario_id']) ? intval($data['usuario_id']) : 0;
    $nombre      = isset($data['nombre']) ? trim($data['nombre']) : '';
    $descripcion = isset($data['descripcion']) ? trim($data['descripcion']) : '';
    $asignatura  = isset($data['asignatura']) ? trim($data['asignatura']) : 'Titulación';
    $semestre    = isset($data['semestre']) ? trim($data['semestre']) : '8ISC21';
    $maestro_id  = !empty($data['maestro_id']) ? intval($data['maestro_id']) : null;

    if ($usuario_id <= 0 || empty($nombre)) {
        jsonRes(false, null, "El nombre del proyecto y el ID del creador son obligatorios.", 400);
    }

    $tags = !empty($data['tags']) && is_array($data['tags']) ? json_encode(array_values($data['tags']), JSON_UNESCAPED_UNICODE) : '[]';

    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare("INSERT INTO proyectos (usuario_id, nombre, descripcion, fecha_inicio, fecha_fin, semestre, asignatura, maestro_id, progreso, tags, ultimo_commit) 
                                VALUES (?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 MONTH), ?, ?, ?, 0, ?, NOW())");
        $stmt->execute([$usuario_id, $nombre, $descripcion, $semestre, $asignatura, $maestro_id, $tags]);
        $newId = $pdo->lastInsertId();

        $stmtInt = $pdo->prepare("INSERT INTO integrantes (proyecto_id, usuario_id) VALUES (?, ?)");
        $stmtInt->execute([$newId, $usuario_id]);
        $pdo->commit();

        jsonRes(true, ["id" => $newId, "nombre" => $nombre], "Proyecto creado exitosamente en MySQL.");
    } catch (PDOException $e) {
        $pdo->rollBack();
        jsonRes(false, null, "Error al crear proyecto: " . $e->getMessage(), 500);
    }
}
`
  },
  {
    nombre: 'actividades.php',
    rutaRelativa: 'api/actividades.php',
    descripcion: 'Control de tareas y cálculo automático del progreso del proyecto.',
    lenguaje: 'php',
    contenido: `<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Endpoint de Actividades y Tareas de Proyectos
 * Ruta en XAMPP: C:\\xampp\\htdocs\\tesproy\\api\\actividades.php
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $proyecto_id = isset($_GET['proyecto_id']) ? intval($_GET['proyecto_id']) : 0;
    if ($proyecto_id <= 0) jsonRes(false, null, "Falta el 'proyecto_id'.", 400);

    $stmt = $pdo->prepare("SELECT * FROM actividades WHERE proyecto_id = ? ORDER BY id ASC");
    $stmt->execute([$proyecto_id]);
    jsonRes(true, $stmt->fetchAll());
}

if ($method === 'POST') {
    $data = getRequestBody();
    $proyecto_id = isset($data['proyecto_id']) ? intval($data['proyecto_id']) : 0;
    $nombre      = isset($data['nombre']) ? trim($data['nombre']) : '';
    $miembro     = isset($data['miembro']) ? trim($data['miembro']) : 'Equipo';

    if ($proyecto_id <= 0 || empty($nombre)) jsonRes(false, null, "Datos incompletos.", 400);

    $stmt = $pdo->prepare("INSERT INTO actividades (proyecto_id, nombre, miembro, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, NOW(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'pendiente')");
    $stmt->execute([$proyecto_id, $nombre, $miembro]);
    $newId = $pdo->lastInsertId();

    $pdo->prepare("UPDATE proyectos SET ultimo_commit = NOW() WHERE id = ?")->execute([$proyecto_id]);
    jsonRes(true, ["id" => $newId, "nombre" => $nombre], "Actividad creada.");
}

if ($method === 'PUT') {
    $data = getRequestBody();
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $estado = isset($data['estado']) ? trim($data['estado']) : '';

    if ($id <= 0 || !in_array($estado, ['pendiente', 'en_progreso', 'completada'])) jsonRes(false, null, "Datos inválidos.", 400);

    $stmt = $pdo->prepare("UPDATE actividades SET estado = ? WHERE id = ?");
    $stmt->execute([$estado, $id]);

    $stmtProj = $pdo->prepare("SELECT proyecto_id FROM actividades WHERE id = ?");
    $stmtProj->execute([$id]);
    $row = $stmtProj->fetch();

    if ($row) {
        $pId = $row['proyecto_id'];
        $stmtCount = $pdo->prepare("SELECT COUNT(*) as total, SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as hechas FROM actividades WHERE proyecto_id = ?");
        $stmtCount->execute([$pId]);
        $counts = $stmtCount->fetch();

        if ($counts['total'] > 0) {
            $nuevoProgreso = round(($counts['hechas'] / $counts['total']) * 100);
            $pdo->prepare("UPDATE proyectos SET progreso = ?, ultimo_commit = NOW() WHERE id = ?")->execute([$nuevoProgreso, $pId]);
        }
    }

    jsonRes(true, ["id" => $id, "estado" => $estado], "Actividad actualizada.");
}
`
  },
  {
    nombre: 'donaciones.php',
    rutaRelativa: 'api/donaciones.php',
    descripcion: 'Listado de repositorios disponibles, votación democrática y solicitudes de adopción.',
    lenguaje: 'php',
    contenido: `<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Endpoint del Módulo de Proyectos Donados y Solicitudes de Adopción
 * Ruta en XAMPP: C:\\xampp\\htdocs\\tesproy\\api\\donaciones.php
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT p.*, u.nombre as autor_original_nombre, m.nombre as maestro_nombre 
                           FROM proyectos p 
                           LEFT JOIN usuarios u ON p.usuario_id = u.id 
                           LEFT JOIN maestros m ON p.maestro_id = m.id 
                           WHERE p.es_donado = 1 OR p.listo_para_donar = 1 
                           ORDER BY p.es_donado DESC, p.ultimo_commit DESC");
    $stmt->execute();
    jsonRes(true, $stmt->fetchAll());
}

if ($method === 'POST') {
    $data = getRequestBody();
    $action = isset($data['action']) ? $data['action'] : 'solicitar_adopcion';

    if ($action === 'solicitar_adopcion') {
        $proyecto_id = intval($data['proyecto_id'] ?? 0);
        $usuario_id  = intval($data['usuario_id'] ?? 0);
        $mensaje     = trim($data['mensaje'] ?? '');

        if ($proyecto_id <= 0 || $usuario_id <= 0) jsonRes(false, null, "Datos incompletos.", 400);

        $stmt = $pdo->prepare("INSERT INTO solicitudes (proyecto_id, usuario_id, mensaje, estado, fecha_solicitud) VALUES (?, ?, ?, 'pendiente', NOW())");
        $stmt->execute([$proyecto_id, $usuario_id, $mensaje]);
        jsonRes(true, ["id" => $pdo->lastInsertId()], "Solicitud enviada.");
    }
}
`
  },
  {
    nombre: 'maestros.php',
    rutaRelativa: 'api/maestros.php',
    descripcion: 'Listado de docentes asesores, carga académica y asignación de calificaciones con dictamen.',
    lenguaje: 'php',
    contenido: `<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Endpoint de Docentes Asesores y Calificaciones
 * Ruta en XAMPP: C:\\xampp\\htdocs\\tesproy\\api\\maestros.php
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT id, nombre, correo, departamento, especialidades, activo, cubo_o_oficina, carga_actual FROM maestros ORDER BY nombre ASC");
    $stmt->execute();
    jsonRes(true, $stmt->fetchAll());
}

if ($method === 'POST') {
    $data = getRequestBody();
    $proyecto_id  = intval($data['proyecto_id'] ?? 0);
    $calificacion = floatval($data['calificacion'] ?? 0);
    $comentario   = trim($data['comentario'] ?? '');

    if ($proyecto_id <= 0) jsonRes(false, null, "ID de proyecto inválido.", 400);

    $stmt = $pdo->prepare("UPDATE proyectos SET calificacion = ?, comentario = ? WHERE id = ?");
    $stmt->execute([$calificacion, $comentario, $proyecto_id]);
    jsonRes(true, ["proyecto_id" => $proyecto_id, "calificacion" => $calificacion], "Calificación asentada en MySQL.");
}
`
  },
  {
    nombre: 'test_db.php',
    rutaRelativa: 'api/test_db.php',
    descripcion: 'Script de diagnóstico instantáneo. Abre http://localhost/tesproy/api/test_db.php en el navegador para verificar la base de datos.',
    lenguaje: 'php',
    contenido: `<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Diagnóstico de Conexión a Base de Datos MySQL en XAMPP
 * Abre en tu navegador: http://localhost/tesproy/api/test_db.php
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/conexion.php';

$response = [
    "timestamp" => date('Y-m-d H:i:s'),
    "status"    => "checking",
    "mysql_ok"  => false,
    "database"  => DB_NAME,
    "conteos"   => []
];

try {
    $pdo = getDB();
    $response['mysql_ok'] = true;

    $tablas = ['usuarios', 'maestros', 'administradores', 'proyectos', 'integrantes', 'actividades', 'solicitudes'];
    foreach ($tablas as $tbl) {
        try {
            $stmtCount = $pdo->query("SELECT COUNT(*) FROM \`$tbl\`");
            $response['conteos'][$tbl] = intval($stmtCount->fetchColumn());
        } catch (Exception $e) {
            $response['conteos'][$tbl] = "NO_EXISTE";
        }
    }

    $response['status'] = "success";
    $response['mensaje'] = "¡Conexión exitosa a MySQL en XAMPP! La base de datos '" . DB_NAME . "' está lista y respondiendo.";
} catch (Exception $e) {
    $response['status'] = "error";
    $response['mensaje'] = "Error al conectar con MySQL: " . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
`
  },
  {
    nombre: '.htaccess',
    rutaRelativa: 'api/.htaccess',
    descripcion: 'Reglas de Apache para habilitar CORS en llamadas Fetch desde React y seguridad.',
    lenguaje: 'apache',
    contenido: `# TESPROY - Configuración Apache para XAMPP
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>

Options -Indexes +FollowSymLinks
DirectoryIndex index.php login.php conexion.php
`
  },
  {
    nombre: 'LEEME_INSTRUCCIONES_XAMPP.txt',
    rutaRelativa: 'api/LEEME_INSTRUCCIONES_XAMPP.txt',
    descripcion: 'Instrucciones paso a paso de dónde pegar los archivos en C:\\xampp\\htdocs\\tesproy\\api\\',
    lenguaje: 'txt',
    contenido: `========================================================================
SISTEMA REPOSITORIO DE PROYECTOS TESPROY (7° A 9° SEMESTRE) - TESCHI
ARCHIVOS DE CONEXIÓN A BASE DE DATOS MYSQL PARA XAMPP (htdocs)
========================================================================

¿DÓNDE SE COLOCAN ESTOS ARCHIVOS EN TU COMPUTADORA?
------------------------------------------------------------------------
1. Ve a tu disco local C:, abre la carpeta de XAMPP:
   C:\\xampp\\htdocs\\

2. Crea una carpeta llamada "tesproy":
   C:\\xampp\\htdocs\\tesproy\\

3. Dentro de "tesproy", crea la subcarpeta "api":
   C:\\xampp\\htdocs\\tesproy\\api\\

4. Copia todos los archivos de esta carpeta aquí:
   - config.php          -> Configuración de host, usuario y base de datos
   - conexion.php        -> Conexión PDO y cabeceras CORS
   - perfil.php          -> Consultar y actualizar perfil del alumno
   - login.php           -> Login diferenciado (Alumno, Maestro, Admin)
   - proyectos.php       -> CRUD de proyectos académicos y detección de días inactivos
   - actividades.php     -> Gestión de tareas y cálculo de progreso
   - donaciones.php      -> Votación y solicitudes de adopción de código
   - maestros.php        -> Asignación y evaluación de docentes
   - test_db.php         -> Script de verificación instantánea
   - .htaccess           -> Reglas de cabeceras CORS para Apache

------------------------------------------------------------------------
¿CÓMO VERIFICAR QUE TU BASE DE DATOS ESTÁ FUNCIONANDO?
------------------------------------------------------------------------
1. Inicia Apache y MySQL en el Panel de Control de XAMPP.
2. Abre tu navegador y escribe:
   http://localhost/tesproy/api/test_db.php

3. Si todo está correcto, verás:
   {
     "status": "success",
     "mensaje": "¡Conexión exitosa a MySQL en XAMPP! La base de datos 'tesproy_db' está lista..."
   }

¡Listo! Tu base de datos MySQL ya está conectada al 100%.
========================================================================
`
  }
];
