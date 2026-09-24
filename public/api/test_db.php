<?php
/**
 * TESPROY - Repositorio de Proyectos 7° a 9° Semestre (TESCHI)
 * Diagnóstico de Conexión a Base de Datos MySQL en XAMPP
 * Abre en tu navegador: http://localhost/tesproy/api/test_db.php
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/conexion.php';

$response = [
    "timestamp" => date('Y-m-d H:i:s'),
    "status"    => "checking",
    "mysql_ok"  => false,
    "database"  => DB_NAME,
    "tablas"    => [],
    "conteos"   => []
];

try {
    $pdo = getDB();
    $response['mysql_ok'] = true;

    // Verificar tablas existentes
    $stmt = $pdo->query("SHOW TABLES");
    $tablas = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $response['tablas'] = $tablas;

    $tablasEsperadas = ['usuarios', 'maestros', 'administradores', 'proyectos', 'integrantes', 'actividades', 'solicitudes'];
    foreach ($tablasEsperadas as $tbl) {
        if (in_array($tbl, $tablas)) {
            $stmtCount = $pdo->query("SELECT COUNT(*) FROM `$tbl`");
            $response['conteos'][$tbl] = intval($stmtCount->fetchColumn());
        } else {
            $response['conteos'][$tbl] = "NO_EXISTE";
        }
    }

    $response['status'] = "success";
    $response['mensaje'] = "¡Conexión exitosa a MySQL en XAMPP! La base de datos '" . DB_NAME . "' está lista y respondiendo.";
    http_response_code(200);
} catch (Exception $e) {
    $response['status'] = "error";
    $response['mensaje'] = "Error al conectar con MySQL: " . $e->getMessage();
    http_response_code(500);
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
