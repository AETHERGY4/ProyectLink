<?php
/**
 * TESPROY - Repositorio de Proyectos (TESCHI)
 * Endpoint de Docentes Asesores y Calificaciones
 * Ruta: C:\xampp\htdocs\tesproy\api\maestros.php
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// 1. LISTAR DOCENTES ASESORES (GET)
if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT id, nombre, correo, ubicacion, cubiculo, especialidades FROM maestros ORDER BY nombre ASC");
    $stmt->execute();
    $maestros = $stmt->fetchAll();

    foreach ($maestros as &$m) {
        $m['especialidades'] = !empty($m['especialidades']) ? array_map('trim', explode(',', $m['especialidades'])) : [];
    }

    jsonRes(true, $maestros);
}

// 2. ASIGNAR ASESOR O CALIFICAR PROYECTO (POST)
if ($method === 'POST') {
    $data = getRequestBody();
    $action = isset($data['action']) ? $data['action'] : 'calificar';

    // A) Docente califica el proyecto
    if ($action === 'calificar') {
        $proyecto_id  = isset($data['proyecto_id']) ? intval($data['proyecto_id']) : 0;
        $calificacion = isset($data['calificacion']) ? floatval($data['calificacion']) : null;
        $comentario   = isset($data['comentario']) ? trim($data['comentario']) : '';

        if ($proyecto_id <= 0 || $calificacion === null) {
            jsonRes(false, null, "Faltan datos de calificación o ID del proyecto.", 400);
        }

        try {
            $stmt = $pdo->prepare("UPDATE proyectos SET calificacion = ?, comentario = ? WHERE id = ?");
            $stmt->execute([$calificacion, $comentario, $proyecto_id]);

            jsonRes(true, ["proyecto_id" => $proyecto_id, "calificacion" => $calificacion], "Evaluación asentada correctamente en MySQL.");
        } catch (PDOException $e) {
            jsonRes(false, null, "Error al asentar calificación: " . $e->getMessage(), 500);
        }
    }

    // B) Reasignación de asesor
    if ($action === 'reasignar') {
        $proyecto_id = isset($data['proyecto_id']) ? intval($data['proyecto_id']) : 0;
        $maestro_id  = isset($data['maestro_id']) ? intval($data['maestro_id']) : 0;

        if ($proyecto_id <= 0 || $maestro_id <= 0) {
            jsonRes(false, null, "ID de proyecto y de docente requeridos.", 400);
        }

        try {
            $stmt = $pdo->prepare("UPDATE proyectos SET maestro_id = ? WHERE id = ?");
            $stmt->execute([$maestro_id, $proyecto_id]);

            jsonRes(true, ["proyecto_id" => $proyecto_id, "nuevo_asesor_id" => $maestro_id], "Docente asesor reasignado con éxito.");
        } catch (PDOException $e) {
            jsonRes(false, null, "Error en reasignación: " . $e->getMessage(), 500);
        }
    }

    jsonRes(false, null, "Acción no reconocida.", 400);
}

jsonRes(false, null, "Método HTTP no soportado.", 405);