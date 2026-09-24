<?php
/**
 * TESPROY - API de Donaciones y Proyectos
 * Ruta: C:\xampp\htdocs\tesproy\api\donaciones.php
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

$action = isset($_GET['action']) ? $_GET['action'] : '';
if (!$action) {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['action']) ? $data['action'] : '';
}

// 1. OBTENER PROYECTOS DONADOS (GET)
if ($method === 'GET' && ($action === 'proyectos_donados' || $action === '')) {
    try {
        $stmt = $pdo->prepare("SELECT p.id, p.nombre, p.descripcion, p.asignatura, p.semestre,
                                      IFNULL(p.usuario_id, 1) AS usuario_id,
                                      IFNULL(p.maestro_id, 1) AS maestro_id,
                                      p.es_donado, p.listo_para_donar,
                                      COALESCE(u.nombre, 'Jorge Méndez') as autor_original_nombre,
                                      COALESCE(m.nombre, 'Yolanda') as maestro_nombre
                               FROM proyectos p
                               LEFT JOIN usuarios u ON p.usuario_id = u.id
                               LEFT JOIN maestros m ON p.maestro_id = m.id
                               WHERE p.es_donado = 1 OR p.listo_para_donar = 1
                               ORDER BY p.id DESC");
        $stmt->execute();
        $donados = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonRes(true, $donados);
    } catch (PDOException $e) {
        jsonRes(false, [], "Error BD: " . $e->getMessage(), 500);
    }
}

// 2. OBTENER SOLICITUDES (GET)
if ($method === 'GET' && $action === 'solicitudes') {
    try {
        $stmt = $pdo->prepare("SELECT s.*, 
                                      COALESCE(p.nombre, CONCAT('Proyecto #', s.proyecto_id)) as proyecto_nombre, 
                                      COALESCE(p.asignatura, 'Ingeniería de Software') as asignatura,
                                      u.nombre as alumno_nombre, u.correo as alumno_correo
                               FROM solicitudes_proyectos s
                               LEFT JOIN proyectos p ON s.proyecto_id = p.id
                               LEFT JOIN usuarios u ON s.usuario_id = u.id
                               ORDER BY s.id DESC");
        $stmt->execute();
        $solicitudes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonRes(true, $solicitudes);
    } catch (PDOException $e) {
        jsonRes(false, [], "Error al consultar solicitudes: " . $e->getMessage(), 500);
    }
}

// 3. REGISTRAR SOLICITUD (POST)
if ($method === 'POST') {
    $data = getRequestBody();
    $proyecto_id = isset($data['proyecto_id']) ? intval($data['proyecto_id']) : 0;
    $usuario_id  = isset($data['usuario_id']) ? intval($data['usuario_id']) : 0;
    $mensaje     = isset($data['mensaje']) ? trim($data['mensaje']) : '';

    if ($proyecto_id <= 0 || $usuario_id <= 0) {
        jsonRes(false, null, "Identificadores de proyecto y usuario obligatorios.", 400);
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO solicitudes_proyectos (proyecto_id, usuario_id, mensaje, estado, fecha_solicitud) 
                               VALUES (?, ?, ?, 'pendiente', NOW())");
        $stmt->execute([$proyecto_id, $usuario_id, $mensaje]);
        $newId = $pdo->lastInsertId();

        jsonRes(true, [
            "id" => $newId,
            "proyecto_id" => $proyecto_id,
            "usuario_id" => $usuario_id,
            "mensaje" => $mensaje,
            "estado" => "pendiente"
        ], "Solicitud registrada con éxito.");
    } catch (PDOException $e) {
        jsonRes(false, null, "Error SQL: " . $e->getMessage(), 500);
    }
}

jsonRes(false, null, "Método HTTP no soportado.", 405);