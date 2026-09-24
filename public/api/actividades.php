<?php
/**
 * TESPROY - Repositorio de Proyectos (TESCHI)
 * Endpoint de Actividades y Tareas
 * Ruta: C:\xampp\htdocs\tesproy\api\actividades.php
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// 1. OBTENER ACTIVIDADES POR PROYECTO (GET)
if ($method === 'GET') {
    $proyecto_id = isset($_GET['proyecto_id']) ? intval($_GET['proyecto_id']) : 0;
    if ($proyecto_id <= 0) {
        jsonRes(false, null, "Falta el 'proyecto_id'.", 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM actividades WHERE proyecto_id = ? ORDER BY id ASC");
    $stmt->execute([$proyecto_id]);
    $actividades = $stmt->fetchAll();

    jsonRes(true, $actividades);
}

// 2. CREAR NUEVA ACTIVIDAD (POST)
if ($method === 'POST') {
    $data = getRequestBody();

    $proyecto_id = isset($data['proyecto_id']) ? intval($data['proyecto_id']) : 0;
    $nombre      = isset($data['nombre']) ? trim($data['nombre']) : '';
    $miembro     = isset($data['miembro']) ? trim($data['miembro']) : 'Equipo';
    $fecha_inicio= !empty($data['fecha_inicio']) ? $data['fecha_inicio'] : date('Y-m-d');
    $fecha_fin   = !empty($data['fecha_fin']) ? $data['fecha_fin'] : date('Y-m-d', strtotime('+7 days'));

    if ($proyecto_id <= 0 || empty($nombre)) {
        jsonRes(false, null, "El ID de proyecto y el nombre de la actividad son requeridos.", 400);
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO actividades (proyecto_id, nombre, miembro, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, 'pendiente')");
        $stmt->execute([$proyecto_id, $nombre, $miembro, $fecha_inicio, $fecha_fin]);
        $newId = $pdo->lastInsertId();

        // Actualizar commit del proyecto
        $pdo->prepare("UPDATE proyectos SET ultimo_commit = NOW() WHERE id = ?")->execute([$proyecto_id]);

        jsonRes(true, ["id" => $newId, "nombre" => $nombre, "miembro" => $miembro, "estado" => "pendiente", "fecha_inicio" => $fecha_inicio, "fecha_fin" => $fecha_fin], "Actividad creada con éxito.");
    } catch (PDOException $e) {
        jsonRes(false, null, "Error al crear actividad: " . $e->getMessage(), 500);
    }
}

// 3. CAMBIAR ESTADO DE ACTIVIDAD (PUT)
if ($method === 'PUT') {
    $data = getRequestBody();
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $estado = isset($data['estado']) ? trim($data['estado']) : '';

    if ($id <= 0 || !in_array($estado, ['pendiente', 'en_progreso', 'completada'])) {
        jsonRes(false, null, "ID de actividad o estado inválido.", 400);
    }

    try {
        $stmt = $pdo->prepare("UPDATE actividades SET estado = ? WHERE id = ?");
        $stmt->execute([$estado, $id]);

        // Recalcular porcentaje_avance automático del proyecto
        $stmtProj = $pdo->prepare("SELECT proyecto_id FROM actividades WHERE id = ?");
        $stmtProj->execute([$id]);
        $row = $stmtProj->fetch();

        if ($row) {
            $pId = $row['proyecto_id'];
            $stmtCount = $pdo->prepare("SELECT 
                COUNT(*) as total, 
                SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as hechas
                FROM actividades WHERE proyecto_id = ?");
            $stmtCount->execute([$pId]);
            $counts = $stmtCount->fetch();

            if ($counts['total'] > 0) {
                $nuevoProgreso = round(($counts['hechas'] / $counts['total']) * 100);
                $pdo->prepare("UPDATE proyectos SET porcentaje_avance = ?, ultimo_commit = NOW() WHERE id = ?")->execute([$nuevoProgreso, $pId]);
            }
        }

        jsonRes(true, ["id" => $id, "estado" => $estado], "Estado de actividad actualizado.");
    } catch (PDOException $e) {
        jsonRes(false, null, "Error al actualizar actividad: " . $e->getMessage(), 500);
    }
}

jsonRes(false, null, "Método HTTP no soportado.", 405);