-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-09-2026 a las 08:02:43
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `promanage`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `miembro` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('pendiente','completada') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`id`, `proyecto_id`, `nombre`, `miembro`, `fecha_inicio`, `fecha_fin`, `estado`) VALUES
(20, 4, 'WVS (Jorge Adan)', 'JORGE ADAN', '2025-10-02', '2025-10-02', 'pendiente'),
(21, 4, 'UI/UX (Plablo Joel)', 'Pablo Joel', '2025-10-01', '2025-10-01', 'pendiente'),
(27, 7, 'UI/UX', 'Jorge Adan Vazquez Gomez', '2025-10-20', '2025-10-25', 'completada'),
(28, 7, 'Planificacion', 'Luis Roberto Nieto Romero', '2025-10-20', '2025-10-23', 'pendiente'),
(29, 7, 'Diseño web', 'Pablo', '2025-10-20', '2025-10-22', ''),
(30, 11, 'UI/UX', 'Jorge Adan Vazquez Gomez', '2025-10-30', '2025-11-01', 'pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administradores`
--

CREATE TABLE `administradores` (
  `id` int(11) NOT NULL,
  `Administrador` varchar(100) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1 COMMENT '1=activo, 0=inactivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administradores`
--

INSERT INTO `administradores` (`id`, `Administrador`, `Contraseña`, `fecha_registro`, `ultimo_acceso`, `estado`) VALUES
(1, 'serviciosocial@teschi.edu.mx', '$2y$10$w9wPtRVIaQjJGmjVQMAZNujXGkeBU2O.w9lv4c6d5gf19wBAULsCe', '2026-03-13 00:32:54', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivos`
--

CREATE TABLE `archivos` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `archivos`
--

INSERT INTO `archivos` (`id`, `proyecto_id`, `nombre_archivo`, `ruta`, `fecha_subida`) VALUES
(5, 4, 'Sadie_perfil.html', '../uploads/21/4/Sadie_perfil.html', '2025-10-06 15:01:13'),
(6, 4, 'Canelo_perfil.html', '../uploads/21/4/Canelo_perfil.html', '2025-10-06 15:54:11'),
(30, 7, '1761087685_a60b23c69c72_1.2.3.docx', '/Promanagen/uploads/7/7/actividad_27/1761087685_a60b23c69c72_1.2.3.docx', '2025-10-21 17:01:25'),
(32, 11, '1761105425_78aba15326ea_dash.html', '/Promanagen/uploads/7/11/project/code/1761105425_78aba15326ea_dash.html', '2025-10-21 21:57:05'),
(33, 11, '1761105572_a7b2f6490364_AreaTriangulo.java', '/Promanagen/uploads/7/11/project/code/1761105572_a7b2f6490364_AreaTriangulo.java', '2025-10-21 21:59:32'),
(34, 11, '1761152349_8f9f6e3d7cff_Promanagen.zip', '/Promanagen/uploads/7/11/project/code/1761152349_8f9f6e3d7cff_Promanagen.zip', '2025-10-22 10:59:09'),
(35, 13, '1761178206_16ecf1300040_PRACTICA1_ASM.docx', '/Promanagen/uploads/5/13/project/docs/1761178206_16ecf1300040_PRACTICA1_ASM.docx', '2025-10-22 18:10:06'),
(41, 14, '1763599938_aacaf214f830_6ISC21.zip', '/Promanagen/uploads/7/14/project/code/1763599938_aacaf214f830_6ISC21.zip', '2025-11-19 18:52:18'),
(43, 14, '1764106027_090ef581c199_comandos_de_sui.txt', '/Promanagen/uploads/7/14/project/docs/1764106027_090ef581c199_comandos_de_sui.txt', '2025-11-25 15:27:07'),
(45, 14, '1764112860_2adf9e8e0bd2_CasodeRegresi__nEmpresaHotelera.ipynb_-_Colab.pdf', '/Promanagen/uploads/7/14/project/docs/1764112860_2adf9e8e0bd2_CasodeRegresi__nEmpresaHotelera.ipynb_-_Colab.pdf', '2025-11-25 17:21:00'),
(46, 8, '1764175581_14d9ee6315ab_proyecto_mio.zip', '/Promanagen/uploads/7/8/project/code/1764175581_14d9ee6315ab_proyecto_mio.zip', '2025-11-26 10:46:21'),
(48, 14, '1768352477_e4ee39d4c0bf_MicrosoftTeams-video__online-video-cutter.com_.mp4', '/Promanagen/uploads/7/14/project/video/1768352477_e4ee39d4c0bf_MicrosoftTeams-video__online-video-cutter.com_.mp4', '2026-01-13 19:01:17'),
(49, 16, '1768435793_4cf8d37845f1_MicrosoftTeams-video__online-video-cutter.com_.mp4', '/Promanagen/uploads/7/16/project/video/1768435793_4cf8d37845f1_MicrosoftTeams-video__online-video-cutter.com_.mp4', '2026-01-14 18:09:53'),
(50, 8, '1779811017_c0bb458ed05c_soporte-basicas.zip', '/Promanagen/uploads/7/8/project/code/1779811017_c0bb458ed05c_soporte-basicas.zip', '2026-05-26 09:56:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `integrantes`
--

CREATE TABLE `integrantes` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `integrantes`
--

INSERT INTO `integrantes` (`id`, `proyecto_id`, `usuario_id`, `fecha_agregado`) VALUES
(1, 7, 7, '2025-10-07 16:14:06'),
(2, 7, 5, '2025-10-07 16:14:06'),
(3, 7, 20, '2025-10-07 16:14:06'),
(4, 7, 21, '2025-10-07 16:14:06'),
(5, 8, 7, '2025-10-14 00:59:51'),
(6, 8, 23, '2025-10-14 00:59:51'),
(7, 8, 24, '2025-10-14 00:59:51'),
(8, 9, 24, '2025-10-14 01:02:30'),
(9, 9, 21, '2025-10-14 01:02:30'),
(10, 9, 22, '2025-10-14 01:02:30'),
(11, 9, 23, '2025-10-14 01:02:30'),
(18, 11, 7, '2025-10-21 23:44:46'),
(19, 11, 5, '2025-10-21 23:44:46'),
(20, 11, 21, '2025-10-21 23:44:46'),
(21, 11, 23, '2025-10-21 23:44:46'),
(24, 13, 28, '2025-10-23 00:08:33'),
(25, 13, 5, '2025-10-23 00:08:33'),
(26, 13, 23, '2025-10-23 00:08:33'),
(27, 13, 25, '2025-10-23 00:08:33'),
(28, 13, 26, '2025-10-23 00:08:33'),
(29, 14, 7, '2025-11-05 03:20:13'),
(30, 14, 5, '2025-11-05 03:20:13'),
(31, 14, 26, '2025-11-05 03:20:13'),
(32, 14, 31, '2025-11-05 03:20:13'),
(33, 15, 21, '2025-11-12 00:03:35'),
(34, 15, 7, '2025-11-12 00:03:35'),
(35, 16, 7, '2025-11-26 17:27:18'),
(36, 16, 32, '2025-11-26 17:27:18'),
(37, 16, 26, '2025-11-26 17:27:18'),
(38, 17, 33, '2025-11-27 01:10:21'),
(39, 17, 31, '2025-11-27 01:10:21'),
(40, 17, 26, '2025-11-27 01:10:21'),
(42, 8, 5, '2026-07-04 04:57:30'),
(43, 8, 22, '2026-07-04 04:58:01'),
(44, 8, 32, '2026-07-04 04:58:22'),
(45, 8, 34, '2026-07-04 05:21:06'),
(46, 18, 35, '2026-09-11 22:44:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `maestros`
--

CREATE TABLE `maestros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `maestros`
--

INSERT INTO `maestros` (`id`, `nombre`, `correo`) VALUES
(1, 'Yolanda', 'yolanda@teschi.edu.mx'),
(3, 'julio mendez cesar calva', '2034346218@teschi.edu.mx'),
(4, 'Zita Alvarez Cruz', '205644326@tesci.edu.mx'),
(7, 'Ricardo', 'Ricardo@teschi.edu.mx'),
(8, 'Zita Alvarez Cruz', 'Zita@teschi.edu.mx'),
(9, 'Jorge Mendez Calva', 'Jose@teschi.edu.mx');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `proyecto_id` int(11) DEFAULT NULL,
  `leida` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `usuario_id`, `tipo`, `titulo`, `mensaje`, `proyecto_id`, `leida`, `fecha_creacion`) VALUES
(1, 7, 'votacion', 'Nueva votación de donación', 'Se ha iniciado una votación para donar el proyecto: Prueba2', 16, 1, '2025-11-26 17:39:44'),
(2, 32, 'votacion', 'Nueva votación de donación', 'Se ha iniciado una votación para donar el proyecto: Prueba2', 16, 1, '2025-11-26 17:39:44'),
(3, 26, 'votacion', 'Nueva votación de donación', 'Se ha iniciado una votación para donar el proyecto: Prueba2', 16, 1, '2025-11-26 17:39:44'),
(4, 7, 'votacion', 'Nueva votación de donación', 'Has iniciado una votación para donar tu proyecto: Prueba2', 16, 1, '2025-11-26 17:39:44'),
(5, 7, 'votacion', 'Nueva votación de donación', 'Se ha iniciado una votación para donar el proyecto: Prueba2', 16, 1, '2025-11-26 18:07:00'),
(6, 32, 'votacion', 'Nueva votación de donación', 'Se ha iniciado una votación para donar el proyecto: Prueba2', 16, 1, '2025-11-26 18:07:00'),
(7, 26, 'votacion', 'Nueva votación de donación', 'Se ha iniciado una votación para donar el proyecto: Prueba2', 16, 1, '2025-11-26 18:07:00'),
(8, 7, 'votacion', 'Nueva votación de donación', 'Has iniciado una votación para donar tu proyecto: Prueba2', 16, 1, '2025-11-26 18:07:00'),
(9, 7, 'votacion', 'Nueva votación de donación', 'Se ha iniciado una votación para donar el proyecto: Prueba2', 16, 1, '2025-11-26 18:24:05'),
(10, 32, 'votacion', 'Nueva votación de donación', 'Se ha iniciado una votación para donar el proyecto: Prueba2', 16, 1, '2025-11-26 18:24:05'),
(11, 26, 'votacion', 'Nueva votación de donación', 'Se ha iniciado una votación para donar el proyecto: Prueba2', 16, 1, '2025-11-26 18:24:06'),
(12, 7, 'votacion', 'Nueva votación de donación', 'Has iniciado una votación para donar tu proyecto: Prueba2', 16, 1, '2025-11-26 18:24:06'),
(13, 7, 'votacion', 'Nuevo voto registrado', 'Luis Roberto ha votado A FAVOR de donar el proyecto: Prueba2', 16, 1, '2025-11-26 18:52:15'),
(14, 7, 'votacion', 'Nuevo voto registrado', 'Claudia Elizabeth ha votado EN CONTRA de donar el proyecto: Prueba2', 16, 1, '2025-11-26 19:02:17'),
(15, 7, 'votacion', 'Nuevo voto registrado', 'Pablo Joel ha votado EN CONTRA de donar el proyecto: Prueba2', 16, 1, '2025-11-26 19:02:51'),
(16, 7, 'votacion', 'Nuevo voto registrado', 'Luis Roberto ha votado EN CONTRA de donar el proyecto: Prueba2', 16, 1, '2025-11-26 23:30:32'),
(17, 7, 'votacion', 'Nuevo voto registrado', 'Pablo Joel ha votado A FAVOR de donar el proyecto: Prueba2', 16, 1, '2025-11-26 23:31:24'),
(18, 7, 'votacion', 'Nuevo voto registrado', 'Claudia Elizabeth ha votado EN CONTRA de donar el proyecto: Prueba2', 16, 1, '2025-11-26 23:32:15'),
(19, 32, 'votacion', 'Votación Reiniciada', 'La votación para donar el proyecto \'Prueba2\' ha sido reiniciada. Puedes votar nuevamente.', 16, 1, '2025-11-26 23:41:06'),
(20, 26, 'votacion', 'Votación Reiniciada', 'La votación para donar el proyecto \'Prueba2\' ha sido reiniciada. Puedes votar nuevamente.', 16, 1, '2025-11-26 23:41:06'),
(21, 7, 'votacion', 'Nuevo Voto Registrado', 'Claudia Elizabeth ha votado EN CONTRA para donar el proyecto \'Prueba2\'', 16, 1, '2025-11-27 00:49:14'),
(23, 32, 'votacion', 'Votación Reiniciada', 'La votación para donar el proyecto \'Prueba2\' ha sido reiniciada. Puedes votar nuevamente.', 16, 0, '2025-11-27 00:52:41'),
(24, 26, 'votacion', 'Votación Reiniciada', 'La votación para donar el proyecto \'Prueba2\' ha sido reiniciada. Puedes votar nuevamente.', 16, 0, '2025-11-27 00:52:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `codigo_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `semestre` varchar(20) DEFAULT NULL,
  `asignatura` varchar(255) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `ultimo_commit` datetime DEFAULT current_timestamp(),
  `maestro_id` int(11) DEFAULT NULL,
  `calificacion` int(11) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `es_donado` tinyint(1) DEFAULT 0,
  `fecha_donacion` datetime DEFAULT NULL,
  `usuario_id_actual` int(11) DEFAULT NULL,
  `listo_para_donar` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`id`, `usuario_id`, `nombre`, `descripcion`, `fecha_inicio`, `fecha_fin`, `semestre`, `asignatura`, `fecha_creacion`, `ultimo_commit`, `maestro_id`, `calificacion`, `comentario`, `es_donado`, `fecha_donacion`, `usuario_id_actual`, `listo_para_donar`) VALUES
(4, 21, 'CONTROL ESCOLAR', 'SISTEMA EN LINEA PARA ESTUDIANTES Y PROFESORES DE EL TESCHI', NULL, NULL, NULL, NULL, '2025-10-06 15:00:18', '2025-10-06 15:54:11', NULL, NULL, NULL, 0, NULL, NULL, 0),
(5, 21, 'MANUAL SUPREMOS DEL NENE PROGRAMADOR', 'IMPLEMENTACION DE MANUELES TECNICOS Y DE USUARIOS DE UN SISTEMA ESCOLARIZADO DEL CECYTEM', NULL, NULL, NULL, NULL, '2025-10-06 15:55:15', '2025-10-06 15:55:15', NULL, NULL, NULL, 0, NULL, NULL, 0),
(7, 7, 'Promanamen', 'Gestro de proyectos', '2024-02-06', '2025-10-28', '5ISC21', NULL, '2025-10-07 10:14:06', '2025-10-21 17:01:25', 1, NULL, NULL, 1, '2025-11-04 15:30:34', 32, 0),
(8, 7, 'Luis Roberto', 'Proyecto de promanamen', '2023-02-23', '2025-10-16', '3ISC21', 'Sistemas programables', '2025-10-13 18:59:51', '2026-05-26 09:56:57', 3, 100, 'todo completo', 0, NULL, NULL, 0),
(9, 24, 'Aether', 'Proyecto Lokersecur', NULL, NULL, NULL, NULL, '2025-10-13 19:02:30', '2025-10-13 19:02:30', 3, NULL, NULL, 0, NULL, NULL, 0),
(11, 7, 'ProjetFo', 'repositorio de proyectos', '2025-10-13', NULL, '7ISC23', 'IA', '2025-10-21 17:44:46', '2025-10-22 10:59:09', 1, NULL, NULL, 0, NULL, NULL, 0),
(13, 28, 'GENRADOR DE CODIGO P', 'CODIGO QUE AGARRA UNA EXPRESION DE MANERA POSFIJA Y LA DESCOMPONE Y LA PASA A CODIGO P', NULL, NULL, NULL, NULL, '2025-10-22 18:08:33', '2025-10-22 18:10:06', 3, NULL, NULL, 0, NULL, NULL, 0),
(14, 7, 'prueba', 'solo es una prueba', '2025-09-02', NULL, '7ISC23', 'Sistemas programables', '2025-11-04 21:20:13', '2026-01-13 19:01:17', 1, NULL, NULL, 1, '2025-11-04 21:55:05', 32, 1),
(15, 21, 'prueba1', 'rettyguijgfd', '2025-11-12', '2026-06-19', '5ISC21', NULL, '2025-11-11 18:03:35', '2025-11-11 18:03:35', 9, NULL, NULL, 1, '2025-11-11 18:07:34', NULL, 1),
(16, 7, 'TesProg', 'prueba para ver errores del sistema', '2025-11-26', '2026-12-11', 'Base de datos', 'Gestion de proyectos', '2025-11-26 11:27:18', '2026-01-14 18:09:53', 4, NULL, NULL, 0, NULL, NULL, 0),
(17, 33, 'SUPREMO MANUAL DEL ESTUDIANTES PROGRAMADOR EN SISTEMAS COMPUTACIONALES', 'UNA IMPLEMNETACION DE DOCUMENTACION FINAL DEL PROYECTO', '2025-12-01', '2026-01-05', '9ISC21', NULL, '2025-11-26 19:10:21', '2025-11-26 19:10:21', 1, NULL, NULL, 0, NULL, NULL, 0),
(18, 35, 'Tesina', 'proyecto para titulación', '2026-09-11', '2027-06-11', '2026-2', 'Titulación', '2026-09-11 16:44:07', '2026-09-11 16:44:07', 4, NULL, NULL, 0, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_proyectos`
--

CREATE TABLE `solicitudes_proyectos` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `mensaje` text DEFAULT NULL,
  `estado` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
  `fecha_solicitud` datetime DEFAULT NULL,
  `fecha_respuesta` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_proyectos`
--

INSERT INTO `solicitudes_proyectos` (`id`, `proyecto_id`, `usuario_id`, `mensaje`, `estado`, `fecha_solicitud`, `fecha_respuesta`) VALUES
(1, 11, 7, 'estre proyecto esta en uso aun?', 'rechazado', '2025-10-30 09:14:39', NULL),
(2, 7, 32, 'puedo tener este proyecto', 'rechazado', '2025-11-04 16:56:45', NULL),
(3, 7, 32, 'puedo tener este proyecto', 'aprobado', '2025-11-04 16:57:03', NULL),
(4, 14, 32, 'lo quiero para retomarlo', 'aprobado', '2025-11-04 21:58:04', NULL),
(5, 14, 32, 'lo quiero retomar', 'aprobado', '2025-11-04 21:59:12', NULL),
(6, 14, 32, 'lo quiero retomar', 'aprobado', '2025-11-04 21:59:41', NULL),
(7, 15, 32, 'Porque quiero seguir este proyecto', 'rechazado', '2025-11-11 18:16:44', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_recuperacion`
--

CREATE TABLE `solicitudes_recuperacion` (
  `id` int(11) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `estado` enum('pendiente','aprobado') DEFAULT 'pendiente',
  `token` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `fecha_expiracion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `reset_token` varchar(64) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `theme` varchar(20) NOT NULL DEFAULT 'dark',
  `custom_color` varchar(7) NOT NULL DEFAULT '#238636',
  `bg_url` varchar(255) DEFAULT NULL,
  `btn_color` varchar(7) DEFAULT '#238636',
  `header_color` varchar(7) DEFAULT '#161b22',
  `text_color` varchar(7) DEFAULT '#c9d1d9',
  `foto_perfil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `correo`, `contrasena`, `reset_token`, `nombre`, `telefono`, `ubicacion`, `bio`, `theme`, `custom_color`, `bg_url`, `btn_color`, `header_color`, `text_color`, `foto_perfil`) VALUES
(5, '2022452129@teschi.edu.mx', '$2y$10$T6UjiYA.UIT96meoZo7EL.B7XmhcH2gPyzMHk/eSnDX3J/IGgXUpS', NULL, 'Jorge vazquez gomez', '5531391379', 'calle mariano', 'me gustan los perro', 'dark', '#238636', NULL, '#238636', '#161b22', '#c9d1d9', NULL),
(7, 'luis27@gmail.com', '$2y$10$HsvsG57nPXLkpsbe.17onezKbM3p/IwA6SGxftl2ZSu0dGitn.epe', '869c8824a7636f3766e557a0b4c9dc99', 'Luis Roberto', '5583729379', 'Ciudad de México, México', 'Lider del proyecto', 'dark', '#238636', NULL, '#301ad5', '#000000', '#ffffff', '/Promanagen/uploads/profiles/profile_7_1768434151.jpeg'),
(20, 'daniela1@gmail.com', '$2y$10$hSgYQDtMocAru3vo8BWQ/ukz/1zT1yf6UKNSzEB9/6iLffMHkgY3y', NULL, 'daniela mendez', '5568903456', 'Ciudad de México, México', 'estudiante', 'dark', '#238636', NULL, '#238636', '#161b22', '#c9d1d9', NULL),
(21, 'prueba3432@gmail.com', '$2y$10$tmr2QxCQqOt/Gk3ABtsoNu4ZZDd3/qm4tVeBIuF6NWq/fKRfnez0q', NULL, 'Jorge_Mendez_Calva', '556765432390', 'Ciudad de México, México', 'estudiante', 'light', '#16448d', NULL, '#ff0026', '#ffffff', '#000000', NULL),
(22, 'Eli123@gmail.com', '$2y$10$2Q4IndSALRRsoHDmkbYaU.CjoifMrppp5/qU8U92qeIglHKCeR2Xy', NULL, 'Elizabeth Portuguez Eleodoro', '5567894532', 'CD Mexico', 'estudiante', 'dark', '#238636', NULL, '#238636', '#161b22', '#c9d1d9', NULL),
(23, 'Aether2345@gmail.com', '$2y$10$4fNPXYKDbAskiAkoyxZq3.6k7Knk7VM/9vHv/JUyPZHJdOtFGfu3y', NULL, 'Aether', '5567894532', 'CD Mexico', 'estudiante', 'dark', '#238636', NULL, '#238636', '#161b22', '#c9d1d9', NULL),
(24, 'Aether12@gmail.com', '$2y$10$XQKlwAMYlKiASdRjMuKtmO3KIREIUHl6x90iJ7MSOfseJZUgOm31O', NULL, 'Aether', '5567894532', 'CD Mexico', 'estudiante', 'light', '#238636', NULL, '#238636', '#ffffff', '#000000', NULL),
(25, 'Aether10@gmail.com', '$2y$10$5qDRXzLhVIkai.SgCpb7xOxtHQapCBz.jinQEfbESunVm7t36UQYa', NULL, 'Aether', '5567894532', 'CD Mexico', 'estudiante', 'dark', '#238636', NULL, '#238636', '#161b22', '#c9d1d9', NULL),
(26, '2022452113@teschi.edu.mx', '$2y$10$841FJkOSP5XtXR.v.BtFl.K2rgpfyVqnpjpicczPqigWvzGI9E8hi', NULL, 'Pablo Joel', '5511271168', 'dubai', 'Ingeniero de la NASA', 'dark', '#238636', NULL, '#238636', '#161b22', '#c9d1d9', NULL),
(27, 'adanvg3267@gmail.com', '$2y$10$a1roqdws5kjyhIG9HpHt9OslKm4FPq9AuVF3DDpylxrM6sxULkp0a', NULL, 'Jorge Adan Vazque Gomez', '5532917354', 'EDO MEX', 'INGENIERO ISC', 'dark', '#238636', NULL, '#238636', '#161b22', '#c9d1d9', NULL),
(28, 'usuario777@gmail.com', '$2y$10$cuxgFtj1KwpF6RkkwWajHuzqkf5tHJE/0xJ1B1QuOuK8wNltbL33e', NULL, 'Vegeta777', '5566778899', 'EDO MEX', 'INGENIERO EN SISTEMAS COMPUTACIONALES', 'dark', '#238636', NULL, '#6bba36', '#000000', '#c9d1d9', NULL),
(31, '2022441234@teschi.edu.mx', '$2y$10$.2pxGQWcBEHFY.4B/EaOHOzbFaIqt7TI1m.zWDcSKc6XFyQuAwuVi', NULL, 'Jorge Mendez Calva', '5587656783', 'CD Mexico', 'estudiante', 'dark', '#000000', NULL, '#3b82f6', '#f8fafc', '#1e293b', NULL),
(32, '2022441235@teschi.edu.mx', '$2y$10$T4zZfrNlgJ/6er1CmV7SD.GTcYTLztdzFWXQRih1WHu0ST2rOcWKK', NULL, 'Claudia Elizabeth', '5587656783', 'CD Mexico', 'estudiante', 'dark', '#000000', NULL, '#3b82f6', '#f8fafc', '#1e293b', NULL),
(33, 'pruebamodificacion123@gmail.com', '$2y$10$TeD0gd4mjstxMTTlW6b7/uw7feSfN2DYxIvZd.eU8v1keyZWMdBzq', NULL, 'Jose Mendez Calva', '234567', 'Edomex', 'ISC SISTEMAS', 'dark', '#238636', NULL, '#238636', '#161b22', '#c9d1d9', NULL),
(34, '2022452137@teschi.edu.mx', '$2y$10$irDGMtl2hw.6XVnv2.ciieEt6hoRqIZgh3OlKpu0QFKslGStbq2Xe', NULL, 'Angel Valentin Cruz Contreras', '5570737121', 'Chimalhuacan', 'ingeniero', 'dark', '#238636', NULL, '#238636', '#161b22', '#c9d1d9', NULL),
(35, '2023451015@teschi.edu.mx', '$2y$10$7xRNfM/rfmiSIExFEdisZeIoIwfKsIrQPArATZ4vWg6/loygZiYX2', NULL, 'Oswaldo Morquecho', '5518479682', 'Chimalhuacan', 'Estudiante', 'dark', '#238636', NULL, '#238636', '#161b22', '#c9d1d9', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votaciones_donacion`
--

CREATE TABLE `votaciones_donacion` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `voto` enum('a_favor','en_contra','pendiente') DEFAULT 'pendiente',
  `fecha_voto` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `votaciones_donacion`
--

INSERT INTO `votaciones_donacion` (`id`, `proyecto_id`, `usuario_id`, `voto`, `fecha_voto`) VALUES
(1, 14, 7, 'a_favor', '2025-11-05 03:43:04'),
(3, 14, 5, 'a_favor', '2025-11-05 03:44:44'),
(4, 14, 26, 'a_favor', '2025-11-05 03:44:06'),
(5, 14, 31, 'a_favor', '2025-11-05 03:43:39'),
(6, 15, 21, 'a_favor', '2025-11-12 00:05:55'),
(8, 15, 7, 'a_favor', '2025-11-12 00:06:11'),
(12, 11, 7, 'a_favor', '2025-11-20 01:49:24'),
(14, 11, 5, 'pendiente', NULL),
(15, 11, 21, 'pendiente', NULL),
(16, 11, 23, 'pendiente', NULL),
(17, 16, 7, 'a_favor', '2025-11-27 00:53:05'),
(19, 16, 32, 'pendiente', NULL),
(20, 16, 26, 'pendiente', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_id` (`proyecto_id`);

--
-- Indices de la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Administrador` (`Administrador`);

--
-- Indices de la tabla `archivos`
--
ALTER TABLE `archivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_id` (`proyecto_id`);

--
-- Indices de la tabla `integrantes`
--
ALTER TABLE `integrantes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_id` (`proyecto_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `maestros`
--
ALTER TABLE `maestros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `proyecto_id` (`proyecto_id`);

--
-- Indices de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `maestro_id` (`maestro_id`);

--
-- Indices de la tabla `solicitudes_proyectos`
--
ALTER TABLE `solicitudes_proyectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_id` (`proyecto_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `solicitudes_recuperacion`
--
ALTER TABLE `solicitudes_recuperacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `votaciones_donacion`
--
ALTER TABLE `votaciones_donacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_voto` (`proyecto_id`,`usuario_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `administradores`
--
ALTER TABLE `administradores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `archivos`
--
ALTER TABLE `archivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `integrantes`
--
ALTER TABLE `integrantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `maestros`
--
ALTER TABLE `maestros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `solicitudes_proyectos`
--
ALTER TABLE `solicitudes_proyectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `solicitudes_recuperacion`
--
ALTER TABLE `solicitudes_recuperacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `votaciones_donacion`
--
ALTER TABLE `votaciones_donacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `actividades_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `archivos`
--
ALTER TABLE `archivos`
  ADD CONSTRAINT `archivos_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `integrantes`
--
ALTER TABLE `integrantes`
  ADD CONSTRAINT `integrantes_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `integrantes_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`);

--
-- Filtros para la tabla `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `proyectos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `proyectos_ibfk_2` FOREIGN KEY (`maestro_id`) REFERENCES `maestros` (`id`);

--
-- Filtros para la tabla `solicitudes_proyectos`
--
ALTER TABLE `solicitudes_proyectos`
  ADD CONSTRAINT `solicitudes_proyectos_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `solicitudes_proyectos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `votaciones_donacion`
--
ALTER TABLE `votaciones_donacion`
  ADD CONSTRAINT `votaciones_donacion_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `votaciones_donacion_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
