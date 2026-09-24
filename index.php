<?php
/**
 * TESPROY - Repositorio de Proyectos Académicos (TESCHI)
 * Punto de entrada para XAMPP (Apache)
 * Ruta: C:\xampp\htdocs\tesproy\index.php
 */

// Si la carpeta de compilación de React (dist) existe, redirigir automáticamente
if (file_exists(__DIR__ . '/dist/index.html')) {
    header('Location: dist/');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TESPROY - Configuración XAMPP</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: #090d16;
      color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .container {
      max-width: 680px;
      width: 100%;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 20px;
      padding: 36px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid #1f2937;
    }
    .logo {
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 20px;
      color: white;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
    }
    .subtitle {
      font-size: 13px;
      color: #10b981;
      font-weight: 600;
    }
    .badge-status {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 9999px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 18px;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .steps {
      margin: 24px 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .step-card {
      background: #0d1322;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 16px;
    }
    .step-title {
      font-size: 13px;
      font-weight: 700;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .step-num {
      width: 22px;
      height: 22px;
      background: #10b981;
      color: #022c22;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
    }
    .cmd-box {
      background: #030712;
      border: 1px solid #374151;
      color: #38bdf8;
      font-family: 'Consolas', monospace;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: all;
    }
    .shortcut-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 95, 70, 0.1) 100%);
      border: 1px dashed #10b981;
      border-radius: 12px;
      padding: 16px;
      margin: 20px 0;
    }
    .shortcut-title {
      font-size: 13px;
      font-weight: 700;
      color: #34d399;
      margin-bottom: 6px;
    }
    .btn-refresh {
      display: block;
      width: 100%;
      text-align: center;
      padding: 14px;
      background: #10b981;
      color: #022c22;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      border-radius: 12px;
      transition: background 0.2s;
      border: none;
      cursor: pointer;
    }
    .btn-refresh:hover {
      background: #34d399;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">TP</div>
      <div>
        <h1>TESPROY - Repositorio Académico TESCHI</h1>
        <div class="subtitle">Tecnológico de Estudios Superiores de Chimalhuacán</div>
      </div>
    </div>

    <div class="badge-status">
      ⚡ Paso previo necesario: Compilación de React para XAMPP
    </div>

    <p>
      Has colocado los archivos correctamente en <code>C:\xampp\htdocs\tesproy</code>. 
      La pantalla se quedaba en blanco porque los proyectos en React requieren ser compilados 
      (los navegadores y Apache no pueden interpretar archivos <code>.tsx</code> directamente).
    </p>

    <div class="shortcut-card">
      <div class="shortcut-title">⚡ Opción rápida (Doble clic):</div>
      <p style="margin: 0; font-size: 13px; color: #cbd5e1;">
        Dentro de <code>C:\xampp\htdocs\tesproy</code> encontrarás el archivo <strong><code>compilar_tesproy.bat</code></strong>. 
        Solo hazle <strong>doble clic</strong> y él solo instalará y compilará todo.
      </p>
    </div>

    <div class="steps">
      <div class="step-card">
        <div class="step-title">
          <span class="step-num">1</span>
          Abre la terminal en la carpeta del proyecto:
        </div>
        <div class="cmd-box">
          <span>cd C:\xampp\htdocs\tesproy</span>
        </div>
      </div>

      <div class="step-card">
        <div class="step-title">
          <span class="step-num">2</span>
          Instala las dependencias (necesario solo la primera vez):
        </div>
        <div class="cmd-box">
          <span>npm install</span>
        </div>
      </div>

      <div class="step-card">
        <div class="step-title">
          <span class="step-num">3</span>
          Genera los archivos para Apache:
        </div>
        <div class="cmd-box">
          <span>npm run build</span>
        </div>
      </div>
    </div>

    <button class="btn-refresh" onclick="window.location.reload();">
      🔄 Ya ejecuté los comandos: Recargar y entrar a TESPROY
    </button>
  </div>
</body>
</html>
