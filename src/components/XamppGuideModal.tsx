import React, { useState } from 'react';
import JSZip from 'jszip';
import { XAMPP_FILES_PACKAGE, XamppFileItem, SQL_DATABASE_SCHEMA } from '../data/xamppPackage';
import {
  Server,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Code,
  FolderTree,
  Terminal,
  ExternalLink,
  BookOpen,
  X,
  Layers,
  ArrowRight,
  ShieldAlert,
  Download,
  FileText,
  Package
} from 'lucide-react';

interface XamppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const XamppGuideModal: React.FC<XamppGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'archivos_paquete' | 'explicacion' | 'sql' | 'php_conexion' | 'php_login' | 'checklist'>('archivos_paquete');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const downloadSingleFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAllInZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const folder = zip.folder('tesproy_api');
      XAMPP_FILES_PACKAGE.forEach(file => {
        folder?.file(file.nombre, file.contenido);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tesproy_api_xampp.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  const sqlSchema = SQL_DATABASE_SCHEMA;

  const phpConexionCode = `<?php
// ====================================================================
// ARCHIVO: xampp/htdocs/tesproy/api/conexion.php
// Conexión PDO a MySQL en XAMPP para el Repositorio Académico TESCHI
// ====================================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Manejo de preflight request de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$db_name = "tesproy_db";
$username = "root";      // Usuario default en XAMPP
$password = "";          // Contraseña vacía por default en XAMPP

try {
    $pdo = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la base de datos de XAMPP: " . $e->getMessage()
    ]);
    exit();
}
?>`;

  const phpLoginCode = `<?php
// ====================================================================
// ARCHIVO: xampp/htdocs/tesproy/api/login.php
// Endpoint de inicio de sesión distinguiendo Alumno, Maestro y Admin
// ====================================================================

require_once "conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['correo']) || !isset($data['rol'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "mensaje" => "Datos incompletos"]);
    exit();
}

$correo = trim($data['correo']);
$password = isset($data['password']) ? trim($data['password']) : '';
$rol = $data['rol']; // 'estudiante', 'maestro' o 'administrador'

try {
    if ($rol === 'administrador') {
        $stmt = $pdo->prepare("SELECT id, correo, nombre, estado FROM administradores WHERE correo = :correo LIMIT 1");
        $stmt->execute([':correo' => $correo]);
        $user = $stmt->fetch();
        if ($user) {
            echo json_encode([
                "success" => true,
                "rol" => "administrador",
                "usuario" => $user
            ]);
            exit();
        }
    } else if ($rol === 'maestro') {
        $stmt = $pdo->prepare("SELECT id, nombre, correo, departamento, especialidades, activo, cubo_o_oficina, carga_actual FROM maestros WHERE correo = :correo LIMIT 1");
        $stmt->execute([':correo' => $correo]);
        $teacher = $stmt->fetch();
        if ($teacher) {
            echo json_encode([
                "success" => true,
                "rol" => "maestro",
                "maestro" => $teacher
            ]);
            exit();
        }
    } else {
        // Estudiante
        $stmt = $pdo->prepare("SELECT id, correo, nombre, telefono, ubicacion, bio, carrera, semestre, promedio, habilidades, foto_perfil, rol FROM usuarios WHERE correo = :correo LIMIT 1");
        $stmt->execute([':correo' => $correo]);
        $student = $stmt->fetch();
        if ($student) {
            echo json_encode([
                "success" => true,
                "rol" => "estudiante",
                "usuario" => $student
            ]);
            exit();
        }
    }

    http_response_code(401);
    echo json_encode(["success" => false, "mensaje" => "Usuario o credenciales no encontrados para el rol seleccionado"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold font-display text-lg text-white">
                  Guía de Conexión a XAMPP (`htdocs`) y Base de Datos MySQL
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Respuesta Oficial
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Aclaración técnica y scripts PHP/SQL listos para ejecutar con tu base de datos existente en TESCHI
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <button
              onClick={downloadAllInZip}
              disabled={isZipping}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/30"
              title="Descargar todos los archivos PHP, SQL y .htaccess en un solo archivo ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Generando ZIP...' : 'Descargar Todo en ZIP'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('archivos_paquete')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'archivos_paquete'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            <span>📦 Archivos Listos para XAMPP ({XAMPP_FILES_PACKAGE.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('explicacion')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'explicacion'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. ¿Funcionará en XAMPP? (Explicación)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('checklist')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'checklist'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>2. Pasos de Despliegue</span>
          </button>
          <button
            onClick={() => setActiveSubTab('sql')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'sql'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>3. Script SQL para phpMyAdmin</span>
          </button>
          <button
            onClick={() => setActiveSubTab('php_conexion')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'php_conexion'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>4. conexion.php</span>
          </button>
          <button
            onClick={() => setActiveSubTab('php_login')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'php_login'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>5. login.php</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">

          {/* TAB 0: PAQUETE COMPLETO DE ARCHIVOS */}
          {activeSubTab === 'archivos_paquete' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold text-emerald-950">
                      ¡Archivos listos para copiar a tu XAMPP!
                    </p>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Copia estos archivos en la carpeta: <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold">C:\xampp\htdocs\tesproy\api\</code>
                    </p>
                  </div>
                </div>

                <button
                  onClick={downloadAllInZip}
                  disabled={isZipping}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{isZipping ? 'Comprimiendo...' : 'Descargar Todo en .ZIP'}</span>
                </button>
              </div>

              {/* Explorer: Left list of files, Right file viewer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                
                {/* File list sidebar */}
                <div className="md:col-span-4 border-r border-slate-200 bg-slate-50 p-2 space-y-1 max-h-[55vh] overflow-y-auto">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Archivos del Backend ({XAMPP_FILES_PACKAGE.length})
                  </p>
                  {XAMPP_FILES_PACKAGE.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedFileIndex === idx
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className={`w-3.5 h-3.5 shrink-0 ${selectedFileIndex === idx ? 'text-emerald-200' : 'text-slate-400'}`} />
                        <span className="font-mono text-[11px] truncate">{file.nombre}</span>
                      </div>
                      <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                        selectedFileIndex === idx
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {file.lenguaje}
                      </span>
                    </button>
                  ))}
                </div>

                {/* File Content Preview */}
                <div className="md:col-span-8 p-4 flex flex-col justify-between max-h-[55vh] overflow-hidden">
                  {(() => {
                    const current = XAMPP_FILES_PACKAGE[selectedFileIndex] || XAMPP_FILES_PACKAGE[0];
                    return (
                      <div className="flex flex-col h-full">
                        {/* File Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                          <div className="min-w-0">
                            <p className="font-mono font-bold text-xs text-slate-900 flex items-center space-x-2">
                              <span>{current.nombre}</span>
                              <span className="text-[10px] font-normal text-slate-400">({current.rutaRelativa})</span>
                            </p>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {current.descripcion}
                            </p>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              onClick={() => handleCopy(current.contenido, current.nombre)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
                            >
                              {copiedCode === current.nombre ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600">¡Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => downloadSingleFile(current.nombre, current.contenido)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Descargar</span>
                            </button>
                          </div>
                        </div>

                        {/* Code Box */}
                        <pre className="mt-3 p-3 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono leading-relaxed overflow-x-auto overflow-y-auto flex-1 max-h-[40vh]">
                          {current.contenido}
                        </pre>
                      </div>
                    );
                  })()}
                </div>

              </div>
            </div>
          )}

          {/* TAB 1: EXPLICACION CLARA */}
          {activeSubTab === 'explicacion' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-bold text-amber-950">Respuesta directa a tu pregunta:</p>
                  <p className="mt-1">
                    <strong>¿Si copio esto en la carpeta `xampp/htdocs` va a funcionar ya con mi base de datos que tengo?</strong>
                  </p>
                  <p className="mt-2 text-amber-900 leading-relaxed">
                    <strong>La respuesta es:</strong> La <strong>interfaz visual</strong> sí cargará en el navegador al compilarla con <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">npm run build</code>, pero <strong>ningún framework moderno de frontend (React, Vue o Angular) puede conectarse directamente a MySQL desde el navegador</strong> por seguridad. Necesitas los pequeños archivos PHP que te preparamos en esta guía dentro de <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">htdocs/tesproy/api/</code> para consultar tu base de datos existente.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                    <Layers className="w-4 h-4" />
                    <span>Lo que hace el Frontend (React + Vite)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Muestra las pantallas que diseñamos: panel de alumno, panel de maestro, panel de admin, radar de abandono con IA, solicitud de donaciones y tutor académico. Se compila a archivos estáticos (<code className="font-mono text-emerald-700">index.html</code>, <code className="font-mono text-emerald-700">.js</code> y <code className="font-mono text-emerald-700">.css</code>) que Apache en XAMPP sirve instantáneamente.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center space-x-2 text-blue-700 font-bold">
                    <Database className="w-4 h-4" />
                    <span>Lo que hace la API en PHP + MySQL</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Los scripts PHP (<code className="font-mono text-blue-700">conexion.php</code>, <code className="font-mono text-blue-700">login.php</code>, <code className="font-mono text-blue-700">proyectos.php</code>) reciben las peticiones de React mediante <code className="font-mono text-blue-700">fetch()</code>, hacen las consultas SQL con <code className="font-mono text-blue-700">PDO</code> a tu MySQL en phpMyAdmin y devuelven los datos en JSON.
                  </p>
                </div>
              </div>

              {/* Folder Architecture */}
              <div className="bg-slate-900 rounded-xl p-4 text-slate-200">
                <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center space-x-2">
                  <FolderTree className="w-4 h-4" />
                  <span>Estructura exacta recomendada dentro de tu carpeta XAMPP:</span>
                </p>
                <pre className="font-mono text-xs leading-relaxed overflow-x-auto text-slate-300">
{`C:\\xampp\\htdocs\\tesproy\\
├── index.html           <- Archivo compilado de React (de la carpeta dist/)
├── assets\\             <- JS y CSS compilados (de la carpeta dist/)
└── api\\                 <- Tus scripts PHP para hablar con MySQL
    ├── conexion.php     <- Conexión PDO a MySQL (localhost, root, tesproy_db)
    ├── login.php        <- Autenticación de Alumno, Maestro y Admin
    ├── proyectos.php    <- Consulta y registro de proyectos
    ├── donaciones.php   <- Control de donaciones e IA
    └── tutor_ia.php     <- Consultas del Asistente Académico`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: CHECKLIST DE PASOS */}
          {activeSubTab === 'checklist' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">
                Paso a Paso para ponerlo a funcionar en tu computadora con XAMPP:
              </h4>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Abre XAMPP Control Panel y arranca los servicios</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Haz clic en <strong>Start</strong> en <strong>Apache</strong> y <strong>MySQL</strong>. Ambos deben ponerse en color verde.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Importa tu base de datos en phpMyAdmin</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Abre en tu navegador <a href="http://localhost/phpmyadmin" target="_blank" rel="noreferrer" className="text-emerald-700 font-mono underline">http://localhost/phpmyadmin</a>. Ve a la pestaña <strong>Importar</strong> o copia y pega el script SQL de la pestaña 3. Se creará la base de datos <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">tesproy_db</code> con tus tablas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Compila este proyecto de React</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ejecuta en tu terminal: <code className="font-mono bg-slate-900 text-emerald-400 px-2 py-0.5 rounded">npm run build</code>. Esto creará la carpeta <code className="font-mono bg-slate-100 px-1">dist/</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Copia los archivos a XAMPP</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Copia todo el contenido de la carpeta <code className="font-mono">dist/</code> dentro de <code className="font-mono text-emerald-700">C:\xampp\htdocs\tesproy\</code> y crea la subcarpeta <code className="font-mono text-blue-700">api/</code> con los archivos PHP de las pestañas 4 y 5.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    5
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-950 text-sm">¡Listo! Abre el sistema en tu navegador</p>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Ingresa a <a href="http://localhost/tesproy" target="_blank" rel="noreferrer" className="font-mono font-bold underline text-emerald-900">http://localhost/tesproy</a>. Podrás iniciar sesión como Alumno, Maestro o Administrador interactuando con tu MySQL.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCRIPT SQL */}
          {activeSubTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Script de Estructura de Base de Datos MySQL (XAMPP)</h4>
                  <p className="text-xs text-slate-500">Contiene las tablas adaptadas para alumnos de 7mo a 9no semestre, maestros asesores y donaciones.</p>
                </div>
                <button
                  onClick={() => handleCopy(sqlSchema, 'sql')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  {copiedCode === 'sql' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-[50vh] leading-relaxed">
                  {sqlSchema}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: CONEXION PHP */}
          {activeSubTab === 'php_conexion' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Archivo: <code className="text-emerald-700 font-mono">api/conexion.php</code></h4>
                  <p className="text-xs text-slate-500">Maneja la conexión segura mediante PDO con soporte de CORS para tu aplicación React.</p>
                </div>
                <button
                  onClick={() => handleCopy(phpConexionCode, 'php_conexion')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  {copiedCode === 'php_conexion' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-[50vh] leading-relaxed">
                {phpConexionCode}
              </pre>
            </div>
          )}

          {/* TAB 5: LOGIN PHP */}
          {activeSubTab === 'php_login' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Archivo: <code className="text-emerald-700 font-mono">api/login.php</code></h4>
                  <p className="text-xs text-slate-500">Endpoint que diferencia el inicio de sesión entre Alumno, Maestro y Administrador en MySQL.</p>
                </div>
                <button
                  onClick={() => handleCopy(phpLoginCode, 'php_login')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  {copiedCode === 'php_login' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-[50vh] leading-relaxed">
                {phpLoginCode}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Listo para XAMPP 8.x con PHP y MySQL (MariaDB)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Entendido, cerrar guía
          </button>
        </div>

      </div>
    </div>
  );
};
