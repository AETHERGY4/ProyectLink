<?php
/**
 * TESPROY - Repositorio de Proyectos (TESCHI)
 * Endpoint de Autenticación Multirrol y Registro de Alumnos
 * Ruta: C:\xampp\htdocs\tesproy\public\api\login.php
 */

require_once __DIR__ . '/conexion.php';

$pdo = getDB();
$data = getRequestBody();

$accion = isset($data['accion']) ? trim($data['accion']) : 'login';

// ==========================================
// 1. PROCESO DE REGISTRO DE NUEVO ALUMNO
// ==========================================
if ($accion === 'registro') {
    $nombre    = isset($data['nombre']) ? trim($data['nombre']) : '';
    $correo    = isset($data['correo']) ? trim($data['correo']) : '';
    $matricula = isset($data['matricula']) ? trim($data['matricula']) : '';
    $semestre  = isset($data['semestre']) ? trim($data['semestre']) : '7mo Semestre (7ISC21)';
    $telefono  = isset($data['telefono']) ? trim($data['telefono']) : '';
    $password  = isset($data['password']) ? trim($data['password']) : (isset($data['contrasena']) ? trim($data['contrasena']) : '');

    $rawHabilidades = isset($data['habilidades']) ? $data['habilidades'] : '';
    if (is_array($rawHabilidades)) {
        $habilidadesJSON = json_encode($rawHabilidades);
    } elseif (!empty($rawHabilidades)) {
        $lista = array_map('trim', explode(',', $rawHabilidades));
        $habilidadesJSON = json_encode($lista);
    } else {
        $habilidadesJSON = json_encode(["JavaScript", "Git", "Bases de Datos"]);
    }

    if (empty($nombre) || empty($correo) || empty($password)) {
        jsonRes(false, null, "Por favor completa los campos obligatorios (Nombre, Correo y Contraseña).", 400);
    }

    try {
        $checkStmt = $pdo->prepare("SELECT id FROM usuarios WHERE correo = ? OR (matricula = ? AND matricula != '')");
        $checkStmt->execute([$correo, $matricula]);
        if ($checkStmt->fetch()) {
            jsonRes(false, null, "El correo institucional o la matrícula ya están registrados en el sistema.", 400);
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $carreraPredeterminada = "Ingeniería en Sistemas Computacionales";

        $insertStmt = $pdo->prepare("INSERT INTO usuarios (nombre, correo, matricula, semestre, telefono, contrasena, carrera, habilidades, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'estudiante')");
        $exito = $insertStmt->execute([
            $nombre,
            $correo,
            $matricula,
            $semestre,
            $telefono,
            $passwordHash,
            $carreraPredeterminada,
            $habilidadesJSON
        ]);

        if ($exito) {
            $nuevoId = $pdo->lastInsertId();
            jsonRes(true, [
                "id"          => $nuevoId,
                "nombre"      => $nombre,
                "correo"      => $correo,
                "matricula"   => $matricula,
                "semestre"    => $semestre,
                "habilidades" => json_decode($habilidadesJSON),
                "rol"         => "estudiante"
            ], "¡Alumno registrado exitosamente en MySQL!");
        } else {
            jsonRes(false, null, "Error al insertar el registro en la base de datos.", 500);
        }

    } catch (PDOException $e) {
        jsonRes(false, null, "Error SQL: " . $e->getMessage(), 500);
    }
}

// ==========================================
// 2. PROCESO DE INICIO DE SESIÓN (LOGIN)
// ==========================================
$correo = isset($data['correo']) ? trim($data['correo']) : (isset($data['identifier']) ? trim($data['identifier']) : '');
$contrasena = isset($data['contrasena']) ? trim($data['contrasena']) : (isset($data['password']) ? trim($data['password']) : '');
$rolPreferido = isset($data['rol']) ? trim($data['rol']) : '';

if (empty($correo)) {
    jsonRes(false, null, "Ingresa tu correo institucional o matrícula.", 400);
}

try {
    // 1. BUSCAR EN MAESTROS
    if ($rolPreferido === 'maestro' || stripos($correo, 'maestro') !== false || stripos($correo, 'yolanda') !== false) {
        $stmt = $pdo->prepare("SELECT id, nombre, correo, contrasena, ubicacion, cubiculo, especialidades FROM maestros WHERE correo = ? OR nombre LIKE ?");
        $stmt->execute([$correo, "%$correo%"]);
        $maestro = $stmt->fetch();

        if ($maestro) {
            if (!empty($contrasena) && !empty($maestro['contrasena']) && !password_verify($contrasena, $maestro['contrasena']) && $contrasena !== $maestro['contrasena']) {
                jsonRes(false, null, "Contraseña incorrecta.", 401);
            }
            unset($maestro['contrasena']);
            $maestro['especialidades'] = !empty($maestro['especialidades']) ? array_map('trim', explode(',', $maestro['especialidades'])) : [];
            jsonRes(true, [
                "rol"     => "maestro",
                "usuario" => $maestro,
                "token"   => bin2hex(random_bytes(16))
            ], "Bienvenido Docente Asesor " . $maestro['nombre']);
        }
    }

    // 2. BUSCAR EN ADMINISTRADORES
    if ($rolPreferido === 'administrador' || stripos($correo, 'admin') !== false || stripos($correo, 'serviciosocial') !== false) {
        $stmt = $pdo->prepare("SELECT id, Administrador as correo, Contraseña as contrasena, estado FROM administradores WHERE Administrador = ?");
        $stmt->execute([$correo]);
        $admin = $stmt->fetch();

        if ($admin) {
            if (!empty($contrasena) && !empty($admin['contrasena']) && !password_verify($contrasena, $admin['contrasena']) && $contrasena !== $admin['contrasena']) {
                jsonRes(false, null, "Contraseña incorrecta.", 401);
            }
            unset($admin['contrasena']);
            jsonRes(true, [
                "rol"     => "administrador",
                "usuario" => $admin,
                "token"   => bin2hex(random_bytes(16))
            ], "Acceso concedido a Coordinación Administrativa TESCHI");
        }
    }

    // 3. BUSCAR EN USUARIOS (ALUMNOS) - Sin la columna promedio
    $stmt = $pdo->prepare("SELECT id, matricula, correo, contrasena, nombre, telefono, ubicacion, bio, carrera, semestre, habilidades, foto_perfil, rol FROM usuarios WHERE correo = ? OR matricula = ? OR nombre LIKE ?");
    $stmt->execute([$correo, $correo, "%$correo%"]);
    $alumno = $stmt->fetch();

    if ($alumno) {
        if (!empty($contrasena) && !empty($alumno['contrasena']) && !password_verify($contrasena, $alumno['contrasena']) && $contrasena !== $alumno['contrasena']) {
            jsonRes(false, null, "Contraseña incorrecta.", 401);
        }
        unset($alumno['contrasena']);
        if (!empty($alumno['habilidades'])) {
            $dec = json_decode($alumno['habilidades'], true);
            $alumno['habilidades'] = is_array($dec) ? $dec : array_map('trim', explode(',', $alumno['habilidades']));
        } else {
            $alumno['habilidades'] = [];
        }

        jsonRes(true, [
            "rol"     => $alumno['rol'] ?? "estudiante",
            "usuario" => $alumno,
            "token"   => bin2hex(random_bytes(16))
        ], "Bienvenido al Repositorio TESPROY, " . $alumno['nombre']);
    }

    // SI NO SE ENCONTRÓ EN NINGUNA TABLA
    jsonRes(false, null, "Credenciales no encontradas en la base de datos de TESCHI. Revisa tu correo o matrícula.", 401);

} catch (PDOException $e) {
    jsonRes(false, null, "Error en el servidor de base de datos: " . $e->getMessage(), 500);
}