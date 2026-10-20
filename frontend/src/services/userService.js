// URL del backend configurable mediante variables de entorno de Vite.
const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
).replace(/\/$/, '');

// Centraliza fetch, el manejo de errores y la lectura de las respuestas JSON.
async function httpRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
  } catch (error) {
    throw new Error(
      'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.'
    );
  }

  let payload;

  try {
    payload = await response.json();
  } catch (error) {
    throw new Error('El servidor devolvió una respuesta no válida.');
  }

  if (!response.ok) {
    throw new Error(payload.message || `Error HTTP ${response.status}.`);
  }

  return payload;
}

export function getUsers() {
  return httpRequest('/users');
}

export function getUserById(id) {
  return httpRequest(`/users/${encodeURIComponent(id)}`);
}

export function createUser(user) {
  return httpRequest('/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
}

export function updateUser(id, user) {
  return httpRequest(`/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(user)
  });
}

export function deleteUser(id) {
  return httpRequest(`/users/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}
