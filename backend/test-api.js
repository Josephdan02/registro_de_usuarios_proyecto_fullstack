/* Prueba de integración de la API.
 * Crea un usuario de prueba, lo consulta, lo actualiza y lo elimina.
 * No modifica ni elimina otros registros.
 *
 * Uso: con el backend en ejecución, ejecutar `npm test` en la carpeta backend.
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

let passed = 0;
let failed = 0;

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`[OK]   ${name}`);
  } else {
    failed += 1;
    console.log(`[FALLO] ${name} ${detail}`);
  }
}

async function request(method, path, body) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);
  const payload = await response.json();
  return { status: response.status, payload };
}

async function run() {
  console.log(`Probando la API en ${BASE_URL}\n`);

  const health = await request('GET', '/health');
  check('GET /health responde 200 y MySQL conectado',
    health.status === 200 && health.payload.data?.database === 'connected',
    `(estado ${health.status})`);

  const initialList = await request('GET', '/users');
  check('GET /api/users responde 200 con un arreglo',
    initialList.status === 200 && Array.isArray(initialList.payload.data),
    `(estado ${initialList.status})`);

  const invalidEmpty = await request('POST', '/users', { name: '', email: '' });
  check('POST sin datos responde 400',
    invalidEmpty.status === 400,
    `(estado ${invalidEmpty.status})`);

  const invalidEmail = await request('POST', '/users', {
    name: 'Correo Inválido',
    email: 'correo-sin-arroba'
  });
  check('POST con correo inválido responde 400',
    invalidEmail.status === 400,
    `(estado ${invalidEmail.status})`);

  const created = await request('POST', '/users', {
    name: 'Usuario de Prueba',
    email: 'prueba@example.com'
  });
  const userId = created.payload.data?.id;
  check('POST registra el usuario y responde 201',
    created.status === 201 && userId > 0,
    `(estado ${created.status}, respuesta: ${JSON.stringify(created.payload)})`);

  const duplicate = await request('POST', '/users', {
    name: 'Usuario Duplicado',
    email: 'prueba@example.com'
  });
  check('POST con correo duplicado responde 409',
    duplicate.status === 409,
    `(estado ${duplicate.status})`);

  const found = await request('GET', `/users/${userId}`);
  check('GET /api/users/:id encuentra el usuario creado',
    found.status === 200 && found.payload.data?.email === 'prueba@example.com',
    `(estado ${found.status})`);

  const invalidId = await request('GET', '/users/abc');
  check('GET con ID no numérico responde 400',
    invalidId.status === 400,
    `(estado ${invalidId.status})`);

  const notFound = await request('GET', '/users/99999999');
  check('GET con ID inexistente responde 404',
    notFound.status === 404,
    `(estado ${notFound.status})`);

  const updated = await request('PUT', `/users/${userId}`, {
    name: 'Usuario de Prueba Actualizado',
    email: 'prueba.actualizada@example.com'
  });
  check('PUT actualiza el usuario y responde 200',
    updated.status === 200 &&
      updated.payload.data?.name === 'Usuario de Prueba Actualizado' &&
      updated.payload.data?.email === 'prueba.actualizada@example.com',
    `(estado ${updated.status})`);

  const updateNotFound = await request('PUT', '/users/99999999', {
    name: 'No existe',
    email: 'noexiste@example.com'
  });
  check('PUT con ID inexistente responde 404',
    updateNotFound.status === 404,
    `(estado ${updateNotFound.status})`);

  const deleted = await request('DELETE', `/users/${userId}`);
  check('DELETE elimina el usuario y responde 200',
    deleted.status === 200,
    `(estado ${deleted.status})`);

  const afterDelete = await request('GET', `/users/${userId}`);
  check('GET después de DELETE responde 404',
    afterDelete.status === 404,
    `(estado ${afterDelete.status})`);

  const deleteAgain = await request('DELETE', `/users/${userId}`);
  check('DELETE repetido responde 404',
    deleteAgain.status === 404,
    `(estado ${deleteAgain.status})`);

  console.log(`\nResultado: ${passed} pruebas correctas, ${failed} fallidas.`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error('No se pudo completar la prueba:', error.message);
  process.exitCode = 1;
});
