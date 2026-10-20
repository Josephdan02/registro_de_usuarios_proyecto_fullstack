const pool = require('../config/database');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valida y normaliza los datos recibidos en el cuerpo de la petición.
function validateUserData(body) {
  const errors = [];
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!name) {
    errors.push('El nombre es obligatorio.');
  } else if (name.length > 100) {
    errors.push('El nombre no debe superar los 100 caracteres.');
  }

  if (!email) {
    errors.push('El correo electrónico es obligatorio.');
  } else if (email.length > 150) {
    errors.push('El correo electrónico no debe superar los 150 caracteres.');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('El correo electrónico no tiene un formato válido.');
  }

  return { name, email, errors };
}

// Convierte el parámetro :id en un entero positivo.
function parseId(value) {
  if (!/^\d+$/.test(String(value))) {
    return null;
  }

  const id = Number(value);
  return Number.isInteger(id) && id > 0 && id <= 4294967295 ? id : null;
}

function handleDatabaseError(error, res) {
  // Correo duplicado: la tabla tiene un índice UNIQUE sobre email.
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'El correo electrónico ya está registrado. Usa otro correo.'
    });
  }

  // No se muestran detalles internos ni credenciales al cliente.
  console.error(`[usuarios] Error de base de datos: ${error.message}`);
  return res.status(500).json({
    success: false,
    message: 'Ocurrió un error interno al procesar la solicitud.'
  });
}

// GET /api/users
async function getUsers(req, res) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at FROM users ORDER BY id ASC'
    );

    return res.json({
      success: true,
      message: 'Usuarios obtenidos correctamente.',
      data: rows
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

// GET /api/users/:id
async function getUserById(req, res) {
  const userId = parseId(req.params.id);

  if (userId === null) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número entero positivo.'
    });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    return res.json({
      success: true,
      message: 'Usuario encontrado.',
      data: rows[0]
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

// POST /api/users
async function createUser(req, res) {
  const { name, email, errors } = validateUserData(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors
    });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente.',
      data: rows[0]
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

// PUT /api/users/:id
async function updateUser(req, res) {
  const userId = parseId(req.params.id);

  if (userId === null) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número entero positivo.'
    });
  }

  const { name, email, errors } = validateUserData(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors
    });
  }

  try {
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    await pool.execute(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, userId]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    return res.json({
      success: true,
      message: 'Usuario actualizado correctamente.',
      data: rows[0]
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

// DELETE /api/users/:id
async function deleteUser(req, res) {
  const userId = parseId(req.params.id);

  if (userId === null) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número entero positivo.'
    });
  }

  try {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    return res.json({
      success: true,
      message: 'Usuario eliminado correctamente.',
      data: { id: userId }
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
