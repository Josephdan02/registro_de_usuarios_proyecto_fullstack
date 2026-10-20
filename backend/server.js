require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Permite que el frontend (por ejemplo, http://localhost:5173) consuma la API.
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// GET /api/health: comprueba el servidor y la conexión con MySQL.
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    return res.json({
      success: true,
      message: 'Servidor y base de datos disponibles.',
      data: { server: 'ok', database: 'connected' }
    });
  } catch (error) {
    console.error(`[health] MySQL no disponible: ${error.message}`);

    return res.status(503).json({
      success: false,
      message: 'El servidor está activo, pero la base de datos no está disponible.',
      data: { server: 'ok', database: 'disconnected' }
    });
  }
});

app.use('/api/users', userRoutes);

// Ruta no encontrada.
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Ruta no encontrada.'
  });
});

// Manejo centralizado de errores (JSON inválido, cuerpo demasiado grande, etc.).
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'El cuerpo de la petición no contiene un JSON válido.'
    });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'El cuerpo de la petición es demasiado grande.'
    });
  }

  console.error(`[servidor] Error inesperado: ${error.message}`);

  return res.status(500).json({
    success: false,
    message: 'Ocurrió un error interno en el servidor.'
  });
});

async function startServer() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Conexión con MySQL verificada correctamente.');
  } catch (error) {
    console.warn(
      'Advertencia: no se pudo verificar la conexión con MySQL. ' +
        'Revisa el archivo .env y que el servidor MySQL esté iniciado.'
    );
  }

  app.listen(PORT, () => {
    console.log(`API de usuarios escuchando en http://localhost:${PORT}`);
    console.log(`Estado del servidor: http://localhost:${PORT}/api/health`);
  });
}

startServer();
