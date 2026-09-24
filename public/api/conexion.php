<?php
/**
 * TESPROY - Repositorio de Proyectos (TESCHI)
 * Conexión Centralizada PDO para MySQL en XAMPP
 * Ruta: C:\xampp\htdocs\tesproy\api\conexion.php
 */

// Cabeceras HTTP para permitir peticiones AJAX/Fetch desde React (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Atender solicitudes preflight OPTIONS del navegador
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
                "tip"     => "Verifica que en el panel de XAMPP el módulo MySQL esté en verde (Start) y que la base de datos '" . DB_NAME . "' exista."
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }
    return $pdo;
}

// Función auxiliar para responder JSON
function jsonRes($success, $data = null, $error = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        "success" => $success,
        "data"    => $data,
        "error"   => $error
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Obtener datos combinados de GET y POST JSON
function getRequestBody() {
    $raw = file_get_contents("php://input");
    $json = json_decode($raw, true) ?? [];
    return array_merge($_GET, $_POST, $json);
}