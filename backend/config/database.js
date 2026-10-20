const mysql = require('mysql2/promise');

// Carga las variables del archivo .env (host, puerto, usuario, contraseña y base).
require('dotenv').config();

// Pool de conexiones: reutiliza conexiones en lugar de abrir una nueva
// por cada petición HTTP.
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_usuarios',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
