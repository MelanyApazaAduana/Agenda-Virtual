-- ============================================================
-- BASE DE DATOS: AGENDA_VIRTUAL
-- MOTOR: MySQL 8 (utf8mb4 / utf8mb4_unicode_ci)
-- Idempotente: se puede ejecutar varias veces sin perder datos
-- (CREATE ... IF NOT EXISTS). Se ejecuta automaticamente al
-- iniciar el backend (npm run dev / npm start) via config/initDb.js
-- ============================================================

CREATE DATABASE IF NOT EXISTS agenda_virtual
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE agenda_virtual;

-- TABLA DE USUARIOS
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `google_id` VARCHAR(255) UNIQUE,
    `nombre` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(150) UNIQUE NOT NULL,
    `contrasena` VARCHAR(255),
    `rol` ENUM('admin', 'usuario') DEFAULT 'usuario',
    `foto_url` VARCHAR(255),
    `creado_en` TIMESTAMP DEFAULT NOW(),
    `estado` BOOLEAN NOT NULL DEFAULT TRUE,
    `ultimo_acceso` TIMESTAMP NULL,
    `actualizado_en` TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

-- TABLA DE HISTORIAL DE PRODUCTIVIDAD 
CREATE TABLE IF NOT EXISTS `historial_productividad` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `fecha` DATE NOT NULL,
    `tareas_completadas` INTEGER DEFAULT 0,
    `tareas_creadas` INTEGER DEFAULT 0,
    `tareas_vencidas` INTEGER DEFAULT 0,
    `tarea_tiempo_promedio_horas` DECIMAL(8,2),
    `eventos_asistidos` INTEGER DEFAULT 0,
    `eventos_creados` INTEGER DEFAULT 0,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    `actualizado_en` TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    UNIQUE KEY (`usuario_id`, `fecha`),
    INDEX (`usuario_id`, `fecha`)
);

-- TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS `categorias` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `color_hex` VARCHAR(7),
    `icono` VARCHAR(50),
    `tipo_aplicable` ENUM('evento', 'tarea', 'gasto', 'ingreso', 'todos') NOT NULL,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_usuario_nombre_tipo`(`usuario_id`, `nombre`, `tipo_aplicable`)
);

-- TABLA ELEMENTOS (GENERALIZACION TAREA Y EVENTOS)
CREATE TABLE IF NOT EXISTS `elementos` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `categoria_id` INTEGER,
    `titulo` VARCHAR(200) NOT NULL,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    `actualizado_en` TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE SET NULL
);

-- TABLA DE EVENTOS
CREATE TABLE IF NOT EXISTS `eventos` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `elemento_id` INTEGER,
    `descripcion` TEXT,
    `fecha_inicio` datetime not null,
    `fecha_fin` datetime not null,
    `ubicacion` VARCHAR(255),
    `color_etiqueta` VARCHAR(7),
    `estado` ENUM('pendiente', 'en_curso', 'completado', 'cancelado', 'pospuesto', 'vencido') DEFAULT 'pendiente',
    `instancia_id` INTEGER,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`elemento_id`) REFERENCES `elementos`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`instancia_id`) REFERENCES `eventos`(`id`) ON DELETE SET NULL
);

-- TABLA DE INGRESOS (se crea antes que tareas por la FK)
CREATE TABLE IF NOT EXISTS `ingresos` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `monto` DECIMAL(12,2) NOT NULL,
    `fuente` VARCHAR(200),
    `categoria_id` INTEGER,
    `fecha` DATE NOT NULL,
    `detalle` TEXT,
    `evento_id` INTEGER,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE SET NULL
);

-- TABLA DE TAREAS
CREATE TABLE IF NOT EXISTS `tareas` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `elemento_id` INTEGER,
    `descripcion` TEXT,
    `fecha_limite` datetime,
    `fecha_completado` datetime NULL,
    `estado` ENUM('por_hacer', 'completada', 'cancelada') DEFAULT 'por_hacer',
    `prioridad` ENUM('baja', 'media', 'alta', 'urgente') NOT NULL,
    `instancia_id` INTEGER,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    `ingreso_id` INTEGER,
    `presupuesto_asignado` DECIMAL(12,2),
    FOREIGN KEY (`elemento_id`) REFERENCES `elementos`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`instancia_id`) REFERENCES `tareas`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`ingreso_id`) REFERENCES `ingresos`(`id`) ON DELETE SET NULL
);

-- TABLA DE RECURRENCIAS
CREATE TABLE IF NOT EXISTS `recurrencias` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `tipo_entidad` ENUM('evento', 'tarea') NOT NULL,
    `entidad_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `intervalo` ENUM('diario', 'semanal', 'mensual', 'anual') NOT NULL,
    `frecuencia_dias` INTEGER,
    `fecha_inicio` DATETIME,
    `fecha_fin` DATETIME,
    `num_rec` INTEGER,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
);

-- TABLA DE NOTAS
CREATE TABLE IF NOT EXISTS `notas` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `titulo` VARCHAR(200) NOT NULL,
    `contenido` TEXT,
    `audio_url` TEXT,
    `imagen_url` TEXT,
    `estado` ENUM('borrador', 'guardado', 'archivado') DEFAULT 'borrador',
    `fecha_creacion` TIMESTAMP DEFAULT NOW(),
    `fecha_modificacion` TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    `color_fondo` VARCHAR(7),
    `evento_id` INTEGER,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE SET NULL
);

-- TABLA DE RECORDATORIOS
CREATE TABLE IF NOT EXISTS `recordatorios` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `tipo_entidad` ENUM('evento', 'tarea', 'nota') NOT NULL,
    `entidad_id` INTEGER NOT NULL,
    `fecha_envio` datetime NOT NULL,
    `mensaje` VARCHAR(255),
    `estado` ENUM('programado', 'leido', 'pospuesto', 'cancelado') DEFAULT 'programado',
    `creado_en` TIMESTAMP DEFAULT NOW(),
    `repeticiones` INTEGER,
    `fecha_lectura` TIMESTAMP NULL,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    INDEX (`tipo_entidad`, `entidad_id`),
    INDEX (`usuario_id`, `fecha_envio`)
);

-- TABLA DE GASTOS (asociados a tareas o eventos)
CREATE TABLE IF NOT EXISTS `gastos` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `tipo_entidad` ENUM('evento', 'tarea') NOT NULL,
    `entidad_id` INTEGER,
    `monto` DECIMAL(12,2) NOT NULL,
    `fecha` TIMESTAMP DEFAULT NOW(),
    `categoria_id` INTEGER,
    `metodo_pago` VARCHAR(50),
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE SET NULL,
    INDEX (`tipo_entidad`, `entidad_id`),
    INDEX (`usuario_id`, `fecha`)
);

-- TABLA DE PRESUPUESTOS
CREATE TABLE IF NOT EXISTS `presupuestos` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `periodo_tipo` VARCHAR(10) NOT NULL COMMENT 'semanal, mensual',
    `fecha_inicio` DATETIME NOT NULL,
    `fecha_fin` DATETIME NOT NULL,
    `monto_total` DECIMAL(12,2) NOT NULL,
    `monto_gastado` DECIMAL(12,2) DEFAULT 0,
    `limite_personalizado` DECIMAL(12,2),
    `creado_en` TIMESTAMP DEFAULT NOW(),
    `config_presupuesto` INT,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    INDEX (`usuario_id`, `fecha_inicio`, `fecha_fin`)
);

-- TABLA DE RACHA DE PRODUCTIVIDAD
CREATE TABLE IF NOT EXISTS `racha_productividad` (
    `usuario_id` INTEGER PRIMARY KEY,
    `racha_actual` INTEGER DEFAULT 0,
    `racha_maxima` INTEGER DEFAULT 0,
    `ultima_fecha_activa` DATETIME,
    `actualizado_en` TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
);
