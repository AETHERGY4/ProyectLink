@echo off
title Asistente de Compilacion TESPROY para XAMPP
color 0A
echo =========================================================
echo       TESPROY - REPOSITORIO ACADEMICO TESCHI
echo          Asistente de Compilacion para XAMPP
echo =========================================================
echo.
cd /d "%~dp0"

echo [1/3] Verificando instalacion de Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No se encontro Node.js en este equipo.
    echo Para compilar proyectos de React/Vite en XAMPP necesitas tener
    echo Node.js instalado.
    echo.
    echo Descargalo gratis de: https://nodejs.org (Version LTS recomendada)
    echo Una vez instalado, vuelve a ejecutar este archivo.
    echo.
    pause
    exit /b 1
)
echo      Node.js detectado correctamente.
echo.

echo [2/3] Instalando dependencias necesarias (npm install)...
echo      Por favor espera unos momentos...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Ocurrio un error al ejecutar 'npm install'.
    echo Revisa tu conexion a Internet o permisos de usuario.
    echo.
    pause
    exit /b 1
)
echo      Dependencias instaladas con exito.
echo.

echo [3/3] Compilando React y Tailwind para Apache (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Ocurrio un error al ejecutar 'npm run build'.
    echo.
    pause
    exit /b 1
)

echo.
echo =========================================================
echo    COMPILACION FINALIZADA CON EXITO!
echo.
echo    Ya puedes abrir en tu navegador:
echo    http://localhost/tesproy/
echo =========================================================
echo.
pause
