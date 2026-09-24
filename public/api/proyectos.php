<?php
/**
 * TESPROY - Repositorio de Proyectos (TESCHI)
 * Endpoint de Proyectos (Listado, Creación, Actualización y Eliminación)
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// 1. LISTAR PROYECTOS (GET)
if ($method === 'GET') {
    $usuario_id = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;
    $maestro_id = isset($_GET['maestro_id']) ? intval($_GET['maestro_id']) : 0;
    $solo_donados = isset($_GET['donados']) && $_GET['donados'] == '1';

    $sql = "SELECT p.*, 
                   u.nombre as autor_nombre, u.correo as autor_correo,
                   m.nombre as maestro_nombre, m.cubiculo as maestro_cubiculo,
                   DATEDIFF(NOW(), p.ultimo_commit) as dias_inactividad_calc
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
    } elseif ($maestro_id > 0) {
        $sql .= " AND p.maestro_id = ?";
        $params[] = $maestro_id;
    }

    $sql .= " ORDER BY p.ultimo_commit DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $proyectos = $stmt->fetchAll();

    foreach ($proyectos as &$p) {
        $dias = intval($p['dias_inactividad_calc'] ?? 0);
        $p['dias_inactivo'] = $dias;
        $p['porcentaje_avance'] = floatval($p['porcentaje_avance'] ?? 0);
        
        // Cargar integrantes del proyecto
        $stmtInt = $pdo->prepare("SELECT u.id, u.nombre, u.correo FROM integrantes i JOIN usuarios u ON i.usuario_id = u.id WHERE i.proyecto_id = ?");
        $stmtInt->execute([$p['id']]);
        $p['integrantes'] = $stmtInt->fetchAll();
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
    
    // Validar maestro_id de manera segura contra la BD
    $maestro_id = null;
    if (!empty($data['maestro_id']) && intval($data['maestro_id']) > 0) {
        $stmtCheck = $pdo->prepare("SELECT id FROM maestros WHERE id = ?");
        $stmtCheck->execute([intval($data['maestro_id'])]);
        if ($stmtCheck->fetch()) {
            $maestro_id = intval($data['maestro_id']);
        }
    }
    
    $fecha_inicio = !empty($data['fecha_inicio']) ? $data['fecha_inicio'] : date('Y-m-d');
    $fecha_fin    = !empty($data['fecha_fin']) ? $data['fecha_fin'] : date('Y-m-d', strtotime('+4 months'));
    $integrantes  = isset($data['integrantes']) && is_array($data['integrantes']) ? $data['integrantes'] : [];

    if ($usuario_id <= 0 || empty($nombre)) {
        jsonRes(false, null, "El nombre del proyecto y el ID del alumno creador son obligatorios.", 400);
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO proyectos (usuario_id, nombre, descripcion, fecha_inicio, fecha_fin, semestre, asignatura, maestro_id, porcentaje_avance, ultimo_commit) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())");
        $stmt->execute([$usuario_id, $nombre, $descripcion, $fecha_inicio, $fecha_fin, $semestre, $asignatura, $maestro_id]);
        $newId = $pdo->lastInsertId();

        // Asegurar que el creador esté en los integrantes
        if (!in_array($usuario_id, $integrantes)) {
            array_unshift($integrantes, $usuario_id);
        }

        // Registrar integrantes
        $stmtInt = $pdo->prepare("INSERT IGNORE INTO integrantes (proyecto_id, usuario_id) VALUES (?, ?)");
        foreach ($integrantes as $ miembro_id) {
            if (intval($miembro_id) > 0) {
                $stmtInt->execute([$newId, intval($miembro_id)]);
            }
        }

        $pdo->commit();

        jsonRes(true, ["id" => $newId, "nombre" => $nombre], "Proyecto registrado exitosamente en MySQL.");
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        jsonRes(false, null, "Error al crear proyecto en base de datos: " . $e->getMessage(), 500);
    }
}

// 3. ACTUALIZAR PROYECTO (PUT)
if ($method === 'PUT') {
    $data = getRequestBody();
    $id = isset($data['id']) ? intval($data['id']) : 0;

    if ($id <= 0) {
        jsonRes(false, null, "Falta el ID del proyecto.", 400);
    }

    $fields = [];
    $params = [];

    if (isset($data['nombre']))            { $fields[] = "nombre = ?";            $params[] = trim($data['nombre']); }
    if (isset($data['descripcion']))       { $fields[] = "descripcion = ?";       $params[] = trim($data['descripcion']); }
    if (isset($data['porcentaje_avance'])) { $fields[] = "porcentaje_avance = ?"; $params[] = intval($data['porcentaje_avance']); }
    if (isset($data['asignatura']))        { $fields[] = "asignatura = ?";        $params[] = trim($data['asignatura']); }
    if (isset($data['semestre']))          { $fields[] = "semestre = ?";          $params[] = trim($data['semestre']); }
    
    if (array_key_exists('maestro_id', $data)) {
        $mId = null;
        if (!empty($data['maestro_id']) && intval($data['maestro_id']) > 0) {
            $stmtCheck = $pdo->prepare("SELECT id FROM maestros WHERE id = ?");
            $stmtCheck->execute([intval($data['maestro_id'])]);
            if ($stmtCheck->fetch()) {
                $mId = intval($data['maestro_id']);
            }
        }
        $fields[] = "maestro_id = ?";
        $params[] = $mId;
    }

    if (isset($data['calificacion']))      { $fields[] = "calificacion = ?";      $params[] = floatval($data['calificacion']); }
    if (isset($data['comentario']))        { $fields[] = "comentario = ?";        $params[] = trim($data['comentario']); }
    if (isset($data['listo_para_donar']))   { $fields[] = "listo_para_donar = ?"; $params[] = $data['listo_para_donar'] ? 1 : 0; }
    if (isset($data['es_donado']))         { $fields[] = "es_donado = ?";         $params[] = $data['es_donado'] ? 1 : 0; }
    if (!empty($data['nuevo_commit']))     { $fields[] = "ultimo_commit = NOW()"; }

    if (!empty($fields)) {
        $params[] = $id;
        $sql = "UPDATE proyectos SET " . implode(", ", $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }

    // Actualizar integrantes si se envían
    if (isset($data['integrantes']) && is_array($data['integrantes'])) {
        $stmtDel = $pdo->prepare("DELETE FROM integrantes WHERE proyecto_id = ?");
        $stmtDel->execute([$id]);

        $stmtInt = $pdo->prepare("INSERT IGNORE INTO integrantes (proyecto_id, usuario_id) VALUES (?, ?)");
        foreach ($data['integrantes'] as $miembro_id) {
            if (intval($miembro_id) > 0) {
                $stmtInt->execute([$id, intval($miembro_id)]);
            }
        }
    }

    jsonRes(true, ["id" => $id], "Proyecto actualizado correctamente.");
}

// 4. ELIMINAR PROYECTO (DELETE)
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        jsonRes(false, null, "Falta el ID del proyecto a eliminar.", 400);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM proyectos WHERE id = ?");
        $stmt->execute([$id]);
        jsonRes(true, ["id" => $id], "Proyecto eliminado correctamente.");
    } catch (PDOException $e) {
        jsonRes(false, null, "Error al eliminar proyecto: " . $e->getMessage(), 500);
    }
}

jsonRes(false, null, "Método HTTP no soportado.", 405);