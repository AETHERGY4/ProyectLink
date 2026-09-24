<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión a la base de datos (ajusta tu usuario y contraseña si es necesario)
$host = 'localhost';
$db   = 'tesproy_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $e->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $proyecto_id = $_GET['proyecto_id'] ?? null;
    if ($proyecto_id) {
        $stmt = $pdo->prepare('SELECT * FROM votaciones_donacion WHERE proyecto_id = ?');
        $stmt->execute([$proyecto_id]);
        $votos = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $votos]);
    } else {
        $stmt = $pdo->query('SELECT * FROM votaciones_donacion');
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    }
} 
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $proyecto_id = $input['proyecto_id'] ?? null;
    $usuario_id = $input['usuario_id'] ?? null;
    $voto = $input['voto'] ?? null; // 'a_favor' o 'en_contra'

    if (!$proyecto_id || !$usuario_id || !$voto) {
        echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios']);
        exit();
    }

    // Verificar si ya votó para actualizar o insertar
    $stmtCheck = $pdo->prepare('SELECT id FROM votaciones_donacion WHERE proyecto_id = ? AND usuario_id = ?');
    $stmtCheck->execute([$proyecto_id, $usuario_id]);
    $existing = $stmtCheck->fetch();

    $now = date('Y-m-d H:i:s');

    if ($existing) {
        $stmtUpdate = $pdo->prepare('UPDATE votaciones_donacion SET voto = ?, fecha_voto = ? WHERE id = ?');
        $stmtUpdate->execute([$voto, $now, $existing['id']]);
        echo json_encode(['success' => true, 'mensaje' => 'Voto actualizado correctamente']);
    } else {
        $stmtInsert = $pdo->prepare('INSERT INTO votaciones_donacion (proyecto_id, usuario_id, voto, fecha_voto) VALUES (?, ?, ?, ?)');
        $stmtInsert->execute([$proyecto_id, $usuario_id, $voto, $now]);
        echo json_encode(['success' => true, 'mensaje' => 'Voto registrado correctamente']);
    }
}
?>