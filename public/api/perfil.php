<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Endpoint de Perfil de Estudiante (Consulta y Modificación)
 * Ruta en XAMPP: C:\xampp\htdocs\tesproy\api\perfil.php
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

    // Decodificar habilidades si están guardadas en JSON o como texto separado por comas
    if (!empty($usuario['habilidades'])) {
        $decoded = json_decode($usuario['habilidades'], true);
        if (is_array($decoded)) {
            $usuario['habilidades'] = $decoded;
        } else {
            $usuario['habilidades'] = array_map('trim', explode(',', $usuario['habilidades']));
        }
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

    // Verificar que el estudiante exista
    $stmtCheck = $pdo->prepare("SELECT id FROM usuarios WHERE id = ?");
    $stmtCheck->execute([$id]);
    if (!$stmtCheck->fetch()) {
        jsonRes(false, null, "No se encontró el estudiante con ID " . $id, 404);
    }

    // Procesar campos a actualizar
    $nombre      = isset($data['nombre']) ? trim($data['nombre']) : null;
    $telefono    = isset($data['telefono']) ? trim($data['telefono']) : null;
    $ubicacion   = isset($data['ubicacion']) ? trim($data['ubicacion']) : null;
    $bio         = isset($data['bio']) ? trim($data['bio']) : null;
    $carrera     = isset($data['carrera']) ? trim($data['carrera']) : null;
    $semestre    = isset($data['semestre']) ? trim($data['semestre']) : null;
    $promedio    = isset($data['promedio']) ? floatval($data['promedio']) : null;
    $foto_perfil = isset($data['foto_perfil']) ? trim($data['foto_perfil']) : null;

    // Procesar habilidades a formato JSON
    $habilidades = null;
    if (isset($data['habilidades'])) {
        if (is_array($data['habilidades'])) {
            $habilidades = json_encode(array_values($data['habilidades']), JSON_UNESCAPED_UNICODE);
        } else {
            $habilidades = trim($data['habilidades']);
        }
    }

    // Construir UPDATE dinámico
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

    // Si viene cambio de contraseña opcional
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

        // Devolver perfil recién actualizado
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

jsonRes(false, null, "Método HTTP no soportado.", 405);
