-- ============================================================
-- BASE DE DATOS: AGENDA_VIRTUAL (esquema v3)
-- MOTOR: MySQL 8 (utf8mb4 / utf8mb4_unicode_ci)
-- Idempotente: se puede ejecutar varias veces sin perder datos
-- (CREATE ... IF NOT EXISTS). Se ejecuta automaticamente al
-- iniciar el backend (npm run dev / npm start) via config/initDb.js
-- ============================================================

CREATE DATABASE IF NOT EXISTS agenda_virtual_v3
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE agenda_virtual_v3;

-- ============================================================
-- 1. USUARIOS (nucleo del sistema)
-- ============================================================
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `google_id` VARCHAR(255) UNIQUE,
    `nombre` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(150) UNIQUE NOT NULL,
    `contrasena` VARCHAR(255),
    `rol` ENUM('admin', 'usuario') DEFAULT 'usuario',
    `foto_url` VARCHAR(255),
    `estado` BOOLEAN NOT NULL DEFAULT TRUE,
    `ultimo_acceso` TIMESTAMP NULL,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    `actualizado_en` TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

-- ============================================================
-- 2. RECURRENCIAS (reglas de repeticion)
-- Referenciadas por eventos/tareas via recurrencia_id
-- ============================================================
CREATE TABLE IF NOT EXISTS `recurrencias` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `intervalo` ENUM('diario', 'semanal', 'mensual', 'anual') NOT NULL,
    `frecuencia_dias` INTEGER,
    `fecha_inicio` DATETIME NOT NULL,
    `fecha_fin` DATETIME NULL,
    `num_rec` INTEGER NULL,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
);

-- ============================================================
-- 3. ETIQUETAS (maestra de tags; color_hex = color del chip)
-- ============================================================
CREATE TABLE IF NOT EXISTS `etiquetas` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `color_hex` VARCHAR(7) NULL,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_usuario_etiqueta` (`usuario_id`, `nombre`)
);

-- ============================================================
-- 4. EVENTOS (tiempo bloqueado; color_hex = color del item)
-- ============================================================
CREATE TABLE IF NOT EXISTS `eventos` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT,
    `fecha_inicio` DATETIME NOT NULL,
    `fecha_fin` DATETIME NOT NULL,
    `ubicacion` VARCHAR(255),
    `color_hex` VARCHAR(7),
    `estado` ENUM('pendiente', 'en_curso', 'completado', 'cancelado', 'pospuesto', 'vencido') DEFAULT 'pendiente',
    `recurrencia_id` INTEGER NULL,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    `actualizado_en` TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`recurrencia_id`) REFERENCES `recurrencias`(`id`) ON DELETE SET NULL,
    INDEX `idx_eventos_usuario_fecha` (`usuario_id`, `fecha_inicio`)
);

-- ============================================================
-- 5. TAREAS (acciones pendientes; color_hex = color del item)
-- ============================================================
CREATE TABLE IF NOT EXISTS `tareas` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT,
    `fecha_limite` DATETIME NULL,
    `fecha_completado` DATETIME NULL,
    `estado` ENUM('por_hacer', 'en_progreso', 'completada', 'cancelada') DEFAULT 'por_hacer',
    `prioridad` ENUM('baja', 'media', 'alta', 'urgente') NOT NULL DEFAULT 'media',
    `color_hex` VARCHAR(7),
    `recurrencia_id` INTEGER NULL,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    `actualizado_en` TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`recurrencia_id`) REFERENCES `recurrencias`(`id`) ON DELETE SET NULL,
    INDEX `idx_tareas_usuario_fecha` (`usuario_id`, `fecha_limite`)
);

-- ============================================================
-- 6. ENTIDAD_ETIQUETAS (pivote N a N, polimorfico)
-- Sin FK en entidad_id (apunta a 4 tablas); integridad desde backend
-- ============================================================
CREATE TABLE IF NOT EXISTS `entidad_etiquetas` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `etiqueta_id` INTEGER NOT NULL,
    `entidad_tipo` ENUM('evento', 'tarea', 'ingreso', 'gasto') NOT NULL,
    `entidad_id` INTEGER NOT NULL,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`etiqueta_id`) REFERENCES `etiquetas`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_vinculo` (`etiqueta_id`, `entidad_tipo`, `entidad_id`),
    INDEX `idx_entidad_busqueda` (`entidad_tipo`, `entidad_id`)
);

-- ============================================================
-- 7. PRESUPUESTOS (registro historico)
-- El vigente = el ultimo creado antes de una fecha dada
-- ============================================================
CREATE TABLE IF NOT EXISTS `presupuestos` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `monto_total` DECIMAL(12,2) NOT NULL,
    `limite_personalizado` DECIMAL(12,2) NULL,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    INDEX `idx_presupuestos_usuario` (`usuario_id`, `creado_en`)
);

-- ============================================================
-- 8. INGRESOS (movimientos globales, sin vinculo a eventos/tareas)
-- ============================================================
CREATE TABLE IF NOT EXISTS `ingresos` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `presupuesto_id` INTEGER NULL,
    `monto` DECIMAL(12,2) NOT NULL,
    `fuente` VARCHAR(200),
    `fecha` DATE NOT NULL,
    `detalle` TEXT,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`presupuesto_id`) REFERENCES `presupuestos`(`id`) ON DELETE SET NULL,
    INDEX `idx_ingresos_usuario_fecha` (`usuario_id`, `fecha`)
);

-- ============================================================
-- 9. GASTOS (opcionalmente ligados a una tarea, nunca a eventos)
-- ============================================================
CREATE TABLE IF NOT EXISTS `gastos` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `presupuesto_id` INTEGER NULL,
    `tarea_id` INTEGER NULL,
    `monto` DECIMAL(12,2) NOT NULL,
    `fecha` DATETIME DEFAULT NOW(),
    `metodo_pago` VARCHAR(50),
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`presupuesto_id`) REFERENCES `presupuestos`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE SET NULL,
    INDEX `idx_gastos_usuario_fecha` (`usuario_id`, `fecha`)
);

-- ============================================================
-- 10. RECORDATORIOS (alerta para UN evento o UNA tarea)
-- ============================================================
CREATE TABLE IF NOT EXISTS `recordatorios` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `evento_id` INTEGER NULL,
    `tarea_id` INTEGER NULL,
    `fecha_envio` DATETIME NOT NULL,
    `mensaje` VARCHAR(255),
    `estado` ENUM('programado', 'leido', 'pospuesto', 'cancelado') DEFAULT 'programado',
    `repeticiones` INTEGER NULL,
    `fecha_lectura` TIMESTAMP NULL,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_recordatorio_entidad` CHECK (
        (`evento_id` IS NOT NULL AND `tarea_id` IS NULL) OR
        (`evento_id` IS NULL AND `tarea_id` IS NOT NULL)
    ),
    INDEX `idx_recordatorios_usuario_envio` (`usuario_id`, `fecha_envio`)
);

-- ============================================================
-- 11. NOTAS (texto/audio/imagen; color_hex = color de fondo)
-- ============================================================
CREATE TABLE IF NOT EXISTS `notas` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `evento_id` INTEGER NULL,
    `tarea_id` INTEGER NULL,
    `titulo` VARCHAR(200) NOT NULL,
    `contenido` TEXT,
    `audio_url` TEXT,
    `imagen_url` TEXT,
    `color_hex` VARCHAR(7),
    `fecha_creacion` TIMESTAMP DEFAULT NOW(),
    `fecha_modificacion` TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE SET NULL
);

-- ============================================================
-- 12. HISTORIAL_PRODUCTIVIDAD (metricas diarias de tareas)
-- ============================================================
CREATE TABLE IF NOT EXISTS `historial_productividad` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `fecha` DATE NOT NULL,
    `tareas_creadas` INTEGER DEFAULT 0,
    `tareas_completadas` INTEGER DEFAULT 0,
    `tareas_vencidas` INTEGER DEFAULT 0,
    `creado_en` TIMESTAMP DEFAULT NOW(),
    `actualizado_en` TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_usuario_fecha` (`usuario_id`, `fecha`)
);

-- ============================================================
-- FIN DEL ESQUEMA v3
-- ============================================================
