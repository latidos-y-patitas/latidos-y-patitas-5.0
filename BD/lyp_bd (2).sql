-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-03-2026 a las 18:54:12
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lyp_bd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `api_tokens`
--

CREATE TABLE `api_tokens` (
  `id_token` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `token` varchar(80) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `api_tokens`
--

INSERT INTO `api_tokens` (`id_token`, `id_usuario`, `token`, `created_at`) VALUES
(28, 1, '610bc494f8b07efcd4fadda2734543689ebd721374690167', '2026-03-13 01:12:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id_cita` bigint(20) UNSIGNED NOT NULL,
  `id_cliente` bigint(20) UNSIGNED NOT NULL,
  `id_disponibilidad` bigint(20) UNSIGNED NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `estado` enum('pendiente','confirmada','cancelada') NOT NULL DEFAULT 'pendiente',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id_cita`, `id_cliente`, `id_disponibilidad`, `motivo`, `estado`, `fecha_creacion`) VALUES
(1, 3, 1, 'Nombre: muñeca; Mascota: Perro; Servicio: Consulta general; Fecha: 2026-03-10; Hora: 15:48', 'confirmada', '2026-03-09 17:48:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contacto_mensajes`
--

CREATE TABLE `contacto_mensajes` (
  `id_mensaje` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `asunto` varchar(150) DEFAULT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('nuevo','leido','archivado') NOT NULL DEFAULT 'nuevo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disponibilidad_citas`
--

CREATE TABLE `disponibilidad_citas` (
  `id_disponibilidad` bigint(20) UNSIGNED NOT NULL,
  `id_veterinario` bigint(20) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` enum('disponible','reservada') NOT NULL DEFAULT 'disponible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `disponibilidad_citas`
--

INSERT INTO `disponibilidad_citas` (`id_disponibilidad`, `id_veterinario`, `fecha`, `hora_inicio`, `hora_fin`, `estado`) VALUES
(1, 1, '2026-03-10', '15:47:00', '17:47:00', 'reservada'),
(4, 1, '2026-03-13', '07:00:00', '10:00:00', 'disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especies`
--

CREATE TABLE `especies` (
  `id_especie` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `especies`
--

INSERT INTO `especies` (`id_especie`, `nombre`, `activo`) VALUES
(1, 'Perro', 1),
(2, 'Gato', 1),
(3, 'loro', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historias_clinicas`
--

CREATE TABLE `historias_clinicas` (
  `id_historia` bigint(20) UNSIGNED NOT NULL,
  `id_mascota` bigint(20) UNSIGNED NOT NULL,
  `fecha_apertura` date DEFAULT NULL,
  `estado` enum('activa','cerrada') NOT NULL DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascotas`
--

CREATE TABLE `mascotas` (
  `id_mascota` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `especie` varchar(50) DEFAULT NULL,
  `raza` varchar(100) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(10) DEFAULT NULL,
  `id_especie` bigint(20) UNSIGNED DEFAULT NULL,
  `id_sexo` bigint(20) UNSIGNED DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `estado` enum('disponible','adoptada') NOT NULL DEFAULT 'disponible',
  `fecha_publicacion` date DEFAULT NULL,
  `id_admin` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mascotas`
--

INSERT INTO `mascotas` (`id_mascota`, `nombre`, `especie`, `raza`, `edad`, `sexo`, `id_especie`, `id_sexo`, `descripcion`, `imagen`, `estado`, `fecha_publicacion`, `id_admin`) VALUES
(1, 'Milo', 'Perro', 'picher', 3, NULL, 1, NULL, 'muy tierno', 'http://localhost/storage/mascotas/esY3PwRXPULuSm63IWsu1vYc4XfvbQS4pa3XyIKA.jpg', 'disponible', '2026-03-09', 1),
(2, 'mike', 'Perro', 'pincher', 4, 'Macho', 1, 2, 'Quiero ser feliz', 'http://localhost/storage/mascotas/DemMf8wVzCTvKPUBUHicMoUodub97g60OzF7u2If.jpg', 'disponible', '2026-03-09', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id_metodo_pago` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_02_10_202507_create_roles_table', 1),
(2, '2026_02_10_202508_create_usuarios_table', 1),
(3, '2026_02_10_202509_create_veterinarios_table', 1),
(4, '2026_02_10_202510_create_mascotas_table', 1),
(5, '2026_02_10_202511_create_disponibilidad_citas_table', 1),
(6, '2026_02_10_202512_create_citas_table', 1),
(7, '2026_02_10_202513_create_historias_clinicas_table', 1),
(8, '2026_02_10_202514_create_registros_clinicos_table', 1),
(9, '2026_02_10_202515_create_solicitudes_adopcion_table', 1),
(10, '2026_02_10_202516_create_metodos_pago_table', 1),
(11, '2026_02_10_202548_create_pagos_table', 1),
(12, '2026_02_23_000001_create_api_tokens_table', 1),
(13, '2026_03_02_160900_add_fields_to_solicitudes_adopcion_table', 1),
(14, '2026_03_05_000001_seed_disponibilidades_demo', 1),
(15, '2026_03_05_000002_seed_citas_demo', 1),
(16, '2026_03_08_000100_add_imagen_to_mascotas_table', 1),
(17, '2026_03_08_000110_create_contacto_mensajes_table', 1),
(18, '2026_03_09_130001_create_especies_table', 2),
(19, '2026_03_09_130002_create_sexos_table', 2),
(20, '2026_03_09_130003_add_especie_sexo_fk_to_mascotas', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` bigint(20) UNSIGNED NOT NULL,
  `id_cita` bigint(20) UNSIGNED NOT NULL,
  `id_metodo_pago` bigint(20) UNSIGNED NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` date DEFAULT NULL,
  `estado` enum('pendiente','pagado','rechazado') NOT NULL DEFAULT 'pendiente',
  `referencia` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_clinicos`
--

CREATE TABLE `registros_clinicos` (
  `id_registro` bigint(20) UNSIGNED NOT NULL,
  `id_historia` bigint(20) UNSIGNED NOT NULL,
  `id_veterinario` bigint(20) UNSIGNED NOT NULL,
  `fecha` date DEFAULT NULL,
  `diagnostico` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `temperatura` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` bigint(20) UNSIGNED NOT NULL,
  `nombre_rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
(1, 'admin'),
(3, 'cliente'),
(2, 'veterinario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sexos`
--

CREATE TABLE `sexos` (
  `id_sexo` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sexos`
--

INSERT INTO `sexos` (`id_sexo`, `nombre`, `activo`) VALUES
(1, 'Hembra', 1),
(2, 'Macho', 1),
(3, 'bolo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_adopcion`
--

CREATE TABLE `solicitudes_adopcion` (
  `id_solicitud` bigint(20) UNSIGNED NOT NULL,
  `id_cliente` bigint(20) UNSIGNED NOT NULL,
  `id_mascota` bigint(20) UNSIGNED NOT NULL,
  `motivo` text DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `tiene_mascotas` tinyint(1) NOT NULL DEFAULT 0,
  `experiencia` text DEFAULT NULL,
  `fecha_solicitud` date DEFAULT NULL,
  `estado` enum('pendiente','aprobada','rechazada') NOT NULL DEFAULT 'pendiente',
  `aprobado_por` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha_revision` date DEFAULT NULL,
  `nota_revision` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `solicitudes_adopcion`
--

INSERT INTO `solicitudes_adopcion` (`id_solicitud`, `id_cliente`, `id_mascota`, `motivo`, `direccion`, `tiene_mascotas`, `experiencia`, `fecha_solicitud`, `estado`, `aprobado_por`, `fecha_revision`, `nota_revision`) VALUES
(1, 3, 1, 'quiero uno', 'Calle Falsa 123, Medellín', 0, 'no tengo', '2026-03-09', 'pendiente', NULL, NULL, NULL),
(2, 3, 2, 'Me gustan', 'calle 25 #71-08', 1, 'asddasdasd', '2026-03-09', 'pendiente', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `id_rol` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `password`, `telefono`, `id_rol`, `created_at`) VALUES
(1, 'admin', 'admin@example.com', '$2y$12$x4wUXrqkMGcpR6StagKk0.Pusg29kU6aKZp.9t2zHP2Ak72plWZbW', '0000000000', 1, '2026-03-09 17:36:21'),
(2, 'veterinario', 'vet@example.com', '$2y$12$siL9mKT12roTayCAifYTkugao2M67HORjuR0g/zJ9War9our/HSHu', '0000000000', 2, '2026-03-09 17:36:50'),
(3, 'cliente', 'cliente@example.com', '$2y$12$A2KyXaM.e5OzWg8dmOENcO0HF0855uRkFvKQw2CqmfVnWWeRM/B8S', '0000000000', 3, '2026-03-09 17:37:17'),
(4, 'Bolivar', 'bolo@gmail.com', '$2y$12$PVfpL7ZijSYqZy66/Py20e8hjeekFi0u56S17i.nIyM7g5645uIWy', NULL, 3, '2026-03-09 21:12:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `veterinarios`
--

CREATE TABLE `veterinarios` (
  `id_veterinario` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `veterinarios`
--

INSERT INTO `veterinarios` (`id_veterinario`, `id_usuario`, `especialidad`) VALUES
(1, 2, 'Ortopedia');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD PRIMARY KEY (`id_token`),
  ADD UNIQUE KEY `api_tokens_token_unique` (`token`),
  ADD KEY `api_tokens_id_usuario_foreign` (`id_usuario`);

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `citas_id_cliente_foreign` (`id_cliente`),
  ADD KEY `citas_id_disponibilidad_foreign` (`id_disponibilidad`);

--
-- Indices de la tabla `contacto_mensajes`
--
ALTER TABLE `contacto_mensajes`
  ADD PRIMARY KEY (`id_mensaje`);

--
-- Indices de la tabla `disponibilidad_citas`
--
ALTER TABLE `disponibilidad_citas`
  ADD PRIMARY KEY (`id_disponibilidad`),
  ADD KEY `disponibilidad_citas_id_veterinario_foreign` (`id_veterinario`);

--
-- Indices de la tabla `especies`
--
ALTER TABLE `especies`
  ADD PRIMARY KEY (`id_especie`),
  ADD UNIQUE KEY `especies_nombre_unique` (`nombre`);

--
-- Indices de la tabla `historias_clinicas`
--
ALTER TABLE `historias_clinicas`
  ADD PRIMARY KEY (`id_historia`),
  ADD UNIQUE KEY `historias_clinicas_id_mascota_unique` (`id_mascota`);

--
-- Indices de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD PRIMARY KEY (`id_mascota`),
  ADD KEY `mascotas_id_admin_foreign` (`id_admin`),
  ADD KEY `mascotas_id_especie_foreign` (`id_especie`),
  ADD KEY `mascotas_id_sexo_foreign` (`id_sexo`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id_metodo_pago`),
  ADD UNIQUE KEY `metodos_pago_nombre_unique` (`nombre`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD UNIQUE KEY `pagos_id_cita_unique` (`id_cita`),
  ADD KEY `pagos_id_metodo_pago_foreign` (`id_metodo_pago`);

--
-- Indices de la tabla `registros_clinicos`
--
ALTER TABLE `registros_clinicos`
  ADD PRIMARY KEY (`id_registro`),
  ADD KEY `registros_clinicos_id_historia_foreign` (`id_historia`),
  ADD KEY `registros_clinicos_id_veterinario_foreign` (`id_veterinario`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `roles_nombre_rol_unique` (`nombre_rol`);

--
-- Indices de la tabla `sexos`
--
ALTER TABLE `sexos`
  ADD PRIMARY KEY (`id_sexo`),
  ADD UNIQUE KEY `sexos_nombre_unique` (`nombre`);

--
-- Indices de la tabla `solicitudes_adopcion`
--
ALTER TABLE `solicitudes_adopcion`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `solicitudes_adopcion_id_cliente_foreign` (`id_cliente`),
  ADD KEY `solicitudes_adopcion_id_mascota_foreign` (`id_mascota`),
  ADD KEY `solicitudes_adopcion_aprobado_por_foreign` (`aprobado_por`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuarios_email_unique` (`email`),
  ADD KEY `usuarios_id_rol_foreign` (`id_rol`);

--
-- Indices de la tabla `veterinarios`
--
ALTER TABLE `veterinarios`
  ADD PRIMARY KEY (`id_veterinario`),
  ADD UNIQUE KEY `veterinarios_id_usuario_unique` (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `api_tokens`
--
ALTER TABLE `api_tokens`
  MODIFY `id_token` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id_cita` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `contacto_mensajes`
--
ALTER TABLE `contacto_mensajes`
  MODIFY `id_mensaje` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `disponibilidad_citas`
--
ALTER TABLE `disponibilidad_citas`
  MODIFY `id_disponibilidad` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `especies`
--
ALTER TABLE `especies`
  MODIFY `id_especie` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `historias_clinicas`
--
ALTER TABLE `historias_clinicas`
  MODIFY `id_historia` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  MODIFY `id_mascota` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_metodo_pago` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registros_clinicos`
--
ALTER TABLE `registros_clinicos`
  MODIFY `id_registro` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sexos`
--
ALTER TABLE `sexos`
  MODIFY `id_sexo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `solicitudes_adopcion`
--
ALTER TABLE `solicitudes_adopcion`
  MODIFY `id_solicitud` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `veterinarios`
--
ALTER TABLE `veterinarios`
  MODIFY `id_veterinario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD CONSTRAINT `api_tokens_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_id_cliente_foreign` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `citas_id_disponibilidad_foreign` FOREIGN KEY (`id_disponibilidad`) REFERENCES `disponibilidad_citas` (`id_disponibilidad`);

--
-- Filtros para la tabla `disponibilidad_citas`
--
ALTER TABLE `disponibilidad_citas`
  ADD CONSTRAINT `disponibilidad_citas_id_veterinario_foreign` FOREIGN KEY (`id_veterinario`) REFERENCES `veterinarios` (`id_veterinario`);

--
-- Filtros para la tabla `historias_clinicas`
--
ALTER TABLE `historias_clinicas`
  ADD CONSTRAINT `historias_clinicas_id_mascota_foreign` FOREIGN KEY (`id_mascota`) REFERENCES `mascotas` (`id_mascota`);

--
-- Filtros para la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD CONSTRAINT `mascotas_id_admin_foreign` FOREIGN KEY (`id_admin`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `mascotas_id_especie_foreign` FOREIGN KEY (`id_especie`) REFERENCES `especies` (`id_especie`) ON DELETE SET NULL,
  ADD CONSTRAINT `mascotas_id_sexo_foreign` FOREIGN KEY (`id_sexo`) REFERENCES `sexos` (`id_sexo`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_id_cita_foreign` FOREIGN KEY (`id_cita`) REFERENCES `citas` (`id_cita`),
  ADD CONSTRAINT `pagos_id_metodo_pago_foreign` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodos_pago` (`id_metodo_pago`);

--
-- Filtros para la tabla `registros_clinicos`
--
ALTER TABLE `registros_clinicos`
  ADD CONSTRAINT `registros_clinicos_id_historia_foreign` FOREIGN KEY (`id_historia`) REFERENCES `historias_clinicas` (`id_historia`),
  ADD CONSTRAINT `registros_clinicos_id_veterinario_foreign` FOREIGN KEY (`id_veterinario`) REFERENCES `veterinarios` (`id_veterinario`);

--
-- Filtros para la tabla `solicitudes_adopcion`
--
ALTER TABLE `solicitudes_adopcion`
  ADD CONSTRAINT `solicitudes_adopcion_aprobado_por_foreign` FOREIGN KEY (`aprobado_por`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `solicitudes_adopcion_id_cliente_foreign` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `solicitudes_adopcion_id_mascota_foreign` FOREIGN KEY (`id_mascota`) REFERENCES `mascotas` (`id_mascota`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_id_rol_foreign` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);

--
-- Filtros para la tabla `veterinarios`
--
ALTER TABLE `veterinarios`
  ADD CONSTRAINT `veterinarios_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
