-- ============================================================
-- Base de datos: sistema_usuarios
-- Proyecto: Registro de usuarios (Node.js + Express + MySQL + React)
-- Ejecutar desde MySQL Workbench o desde la consola de MySQL.
-- ============================================================

CREATE DATABASE IF NOT EXISTS sistema_usuarios
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sistema_usuarios;

-- La tabla se crea solo si no existe. No se eliminan datos existentes.
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- Consulta de comprobación (opcional).
-- SELECT id, name, email, created_at FROM users ORDER BY id;
