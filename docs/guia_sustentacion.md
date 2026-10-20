# Guía de sustentación

**Proyecto:** Sistema de Registro de Usuarios
**Curso:** Fullstack Developer Software — V ciclo, SENATI
**Tema:** Uso del entorno de ejecución backend con JavaScript

> Esta guía está pensada para explicar el proyecto con palabras sencillas durante la sustentación. No se inventaron nombres de integrantes ni tareas individuales: los espacios con «completar» deben llenarse con los datos reales del grupo.

---

## 1. Cómo usar esta guía

1. Leer primero los conceptos base (sección 2).
2. Practicar el recorrido de una petición (sección 8) hasta poder explicarlo sin leer.
3. Ensayar la demostración de 3 a 5 minutos (sección 10).
4. Repartir las responsabilidades (sección 11), pero asegurarse de que **todos** sepan explicar el flujo completo.
5. Completar la plantilla de la PARTE I (sección 12) con las preguntas exactas entregadas por el docente.

---

## 2. Conceptos base explicados de forma sencilla

### Node.js

Node.js es un **entorno de ejecución** que permite ejecutar JavaScript fuera del navegador. Antes, JavaScript solo se ejecutaba en el navegador; con Node.js también puede ejecutarse en el servidor, leer archivos, abrir puertos y conectarse a una base de datos.

En el proyecto, Node.js ejecuta `server.js` y todo el código del backend.

### npm

npm es el **gestor de paquetes de Node.js**. Sirve para:

- Instalar dependencias: `npm install express mysql2 dotenv cors`.
- Guardar las dependencias en `package.json`.
- Ejecutar scripts: `npm start`, `npm run dev`, `npm test`, `npm run build`.

### Express

Express es un **framework minimalista para Node.js** que facilita crear un servidor HTTP y definir rutas.

Ejemplo del proyecto:

```javascript
app.use('/api/users', userRoutes);
```

Eso significa: «todas las peticiones que empiecen con `/api/users` se manejan con las rutas de `userRoutes`».

### MySQL

MySQL es un **sistema gestor de bases de datos relacionales**. Guarda la información en tablas compuestas por filas y columnas.

En este proyecto hay una base llamada `sistema_usuarios` y una tabla `users`:

| Columna | Para qué sirve |
|---|---|
| `id` | Identifica de forma única a cada usuario. |
| `name` | Guarda el nombre. |
| `email` | Guarda el correo; no se permite repetido. |
| `created_at` | Guarda la fecha y hora de creación. |

### React

React es una **biblioteca de JavaScript para construir interfaces**. La pantalla se divide en componentes reutilizables, por ejemplo:

- `UserForm`: el formulario.
- `UserList`: la tabla.
- `UsersPage`: la página completa de consulta.

React actualiza la interfaz cuando cambia el estado, sin manipular el HTML manualmente.

### React Router

React Router permite que una aplicación React tenga varias «páginas» sin recargar el navegador. Se usa `BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate` y `useParams`.

En una SPA, la URL cambia y React decide qué componente mostrar.

### Vite

Vite es la herramienta que sirve el frontend en desarrollo (`npm run dev`) y genera la versión de producción (`npm run build`). No forma parte del backend; solo se usa para React.

---

## 3. ¿Qué es `package.json`?

Es el archivo que describe un proyecto de Node.js. Contiene:

- **Nombre y versión** del proyecto.
- **Scripts**: comandos que se ejecutan con npm.
- **Dependencias**: librerías necesarias para que funcione.
- **devDependencies**: herramientas usadas solo durante el desarrollo (por ejemplo, Vite).

Ejemplo simplificado del backend:

```json
{
  "name": "sistema-usuarios-backend",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "test": "node test-api.js"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^16.6.1",
    "express": "^5.3.0",
    "mysql2": "^3.24.6"
  }
}
```

`package-lock.json` guarda las versiones exactas instaladas para que otra persona obtenga las mismas dependencias con `npm install`.

---

## 4. `mysql2/promise` y `createPool()`

### `mysql2/promise`

`mysql2` es el paquete que conecta Node.js con MySQL. La variante `mysql2/promise` permite usar **promesas**, por lo que se puede escribir:

```javascript
const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
```

en lugar de usar callbacks. `async/await` hace el código más fácil de leer.

### `createPool()`

Un **pool de conexiones** es un conjunto de conexiones reutilizables.

Sin pool, cada petición tendría que abrir y cerrar una conexión a MySQL, lo que consume tiempo y recursos. Con pool:

1. Se crean varias conexiones al iniciar.
2. Una petición toma una conexión libre.
3. Al terminar, la conexión vuelve al pool.
4. Otra petición puede reutilizarla.

Código del proyecto (`backend/config/database.js`):

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

Las credenciales se leen de `.env` mediante `dotenv`. El archivo `.env` no se sube a Git.

---

## 5. Las cuatro operaciones CRUD

CRUD significa **Create, Read, Update, Delete** (crear, leer, actualizar, eliminar).

### CREATE — Crear un usuario

- Método y ruta: `POST /api/users`.
- Recibe `name` y `email` en el cuerpo JSON.
- Valida los datos.
- Ejecuta:

```javascript
const [result] = await pool.execute(
  'INSERT INTO users (name, email) VALUES (?, ?)',
  [name, email]
);
```

- Responde **201 Created** con el usuario creado.

### READ — Leer usuarios

- `GET /api/users`: devuelve todos los usuarios.
- `GET /api/users/:id`: devuelve uno por ID.
- Si el ID no existe, responde **404 Not Found**.
- Si el ID no es un número válido, responde **400 Bad Request**.

```javascript
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);
```

### UPDATE — Actualizar un usuario

- Método y ruta: `PUT /api/users/:id`.
- Verifica que el usuario exista.
- Actualiza nombre y correo.

```javascript
await pool.execute(
  'UPDATE users SET name = ?, email = ? WHERE id = ?',
  [name, email, userId]
);
```

- Si no encuentra el usuario, responde **404**.
- Si el nuevo correo ya pertenece a otro usuario, responde **409 Conflict**.

### DELETE — Eliminar un usuario

- Método y ruta: `DELETE /api/users/:id`.
- Ejecuta:

```javascript
const [result] = await pool.execute(
  'DELETE FROM users WHERE id = ?',
  [userId]
);
```

- Si `affectedRows` es 0, el usuario no existía y responde **404**.
- Si se elimina, responde **200** con un mensaje de confirmación.

---

## 6. `execute()` y los signos `?`

```javascript
await pool.execute(
  'UPDATE users SET name = ?, email = ? WHERE id = ?',
  [newName, newEmail, userId]
);
```

- `execute()` ejecuta una consulta preparada.
- Cada `?` es un **marcador de posición**.
- El arreglo `[newName, newEmail, userId]` contiene los valores en el mismo orden.
- `mysql2` envía la estructura SQL y los datos por separado; escapa los valores y evita inyecciones SQL.

**Incorrecto (nunca hacerlo):**

```javascript
// El valor del usuario se concatena directamente: riesgo de inyección SQL.
const sql = `SELECT * FROM users WHERE email = '${email}'`;
```

**Correcto:**

```javascript
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
```

Ventajas:

1. Evita inyección SQL.
2. Escapa comillas y caracteres especiales.
3. Mantiene el código legible.
4. Permite reutilizar la misma consulta con distintos valores.

---

## 7. Formulario controlado

Un formulario controlado es aquel cuyo contenido depende del **estado de React**, no directamente del DOM.

```jsx
const [values, setValues] = useState({ name: '', email: '' });

function handleChange(event) {
  const { name, value } = event.target;
  setValues((previous) => ({ ...previous, [name]: value }));
}

function handleSubmit(event) {
  event.preventDefault();
  // Aquí se valida y se envía al backend.
}

<input
  name="name"
  value={values.name}
  onChange={handleChange}
/>
```

### `useState`

Crea una variable de estado y una función para actualizarla. Cuando el estado cambia, React vuelve a renderizar el componente.

### `value`

Hace que el input muestre siempre el valor guardado en el estado. Es lo que convierte al formulario en «controlado».

### `onChange`

Se ejecuta en cada cambio del input. Actualiza el estado con `setValues`.

### `onSubmit`

Se ejecuta al enviar el formulario. Ahí se valida y se llama al servicio que hace `fetch`.

### `preventDefault()`

Evita el comportamiento por defecto del formulario, que es recargar la página. Sin esta línea, la SPA se recargaría y se perdería el estado.

### Flujo del formulario

1. El usuario escribe.
2. `onChange` actualiza el estado.
3. El input muestra el nuevo `value`.
4. El usuario pulsa «Registrar».
5. `onSubmit` ejecuta `preventDefault()`.
6. Se validan los datos.
7. `createUser()` hace `fetch` al backend.
8. Express valida y ejecuta el `INSERT`.
9. MySQL guarda el registro.
10. Express responde con JSON.
11. React muestra el mensaje de éxito y limpia el formulario.

---

## 8. Recorrido completo de una petición

Supongamos que el usuario registra a «María López» con el correo `maria@example.com`.

1. **React**: `UserForm` guarda los valores en el estado mediante `onChange`.
2. **React**: al enviar, `onSubmit` ejecuta `event.preventDefault()`.
3. **React**: `userService.createUser()` envía:

   ```http
   POST http://localhost:3000/api/users
   Content-Type: application/json

   { "name": "María López", "email": "maria@example.com" }
   ```

4. **Express**: `express.json()` convierte el cuerpo JSON en un objeto de JavaScript.
5. **Express**: la ruta `POST /api/users` llama a `createUser` del controlador.
6. **Controlador**: valida que el nombre y el correo existan y que el formato del correo sea correcto.
7. **Controlador**: llama a `pool.execute()` con el `INSERT` y los valores.
8. **mysql2**: envía la consulta preparada a MySQL.
9. **MySQL**: guarda la fila, genera el `id` y la fecha `created_at`.
10. **MySQL → Node.js**: devuelve el resultado con `insertId`.
11. **Controlador**: consulta el usuario recién creado y prepara la respuesta.
12. **Express → React**: responde **201** con:

    ```json
    {
      "success": true,
      "message": "Usuario registrado correctamente.",
      "data": { "id": 1, "name": "María López", "email": "maria@example.com", "created_at": "..." }
    }
    ```

13. **React**: recibe la respuesta, muestra el mensaje de éxito y limpia el formulario.
14. **React**: al abrir la lista, `GET /api/users` trae los datos y `UserList` los muestra en la tabla.

Todo esto ocurre **sin recargar la página**.

---

## 9. Preguntas probables del docente

**1. ¿Qué es Node.js?**
Es un entorno de ejecución que permite ejecutar JavaScript en el servidor, fuera del navegador.

**2. ¿Qué diferencia hay entre Node.js y el navegador?**
El navegador ejecuta JavaScript con acceso al DOM y a la interfaz; Node.js ejecuta JavaScript en el servidor con acceso a archivos, red y bases de datos.

**3. ¿Qué es npm?**
El gestor de paquetes de Node.js: instala dependencias y ejecuta scripts del `package.json`.

**4. ¿Qué es Express?**
Un framework para Node.js que simplifica la creación de servidores y rutas HTTP.

**5. ¿Qué es un middleware?**
Una función que se ejecuta entre la petición y la respuesta. Ejemplos del proyecto: `cors()` y `express.json()`.

**6. ¿Para qué se usa `express.json()`?**
Para leer el cuerpo JSON de las peticiones y convertirlo en un objeto de JavaScript accesible desde `req.body`.

**7. ¿Qué es CORS y por qué se configuró?**
CORS es una política de seguridad del navegador. El frontend corre en el puerto 5173 y el backend en el 3000; `cors()` autoriza esa comunicación entre orígenes distintos.

**8. ¿Por qué se usa `mysql2/promise`?**
Porque permite usar `async/await` con MySQL, lo que hace el código más claro y evita los callbacks.

**9. ¿Qué es un pool de conexiones?**
Un conjunto de conexiones reutilizables a la base de datos. Evita abrir y cerrar una conexión en cada petición.

**10. ¿Por qué se usan consultas parametrizadas?**
Para separar el SQL de los datos, evitar inyecciones SQL y permitir que el driver escape los valores.

**11. ¿Qué significa el signo `?` en las consultas?**
Es un marcador de posición que será reemplazado por un valor del arreglo, en orden.

**12. ¿Qué es CRUD?**
Las cuatro operaciones básicas sobre datos: crear, leer, actualizar y eliminar.

**13. ¿Qué códigos HTTP usaron y por qué?**
200 para operaciones exitosas, 201 al crear, 400 para datos inválidos, 404 cuando no existe el recurso, 409 para correo duplicado y 500 para errores internos.

**14. ¿Qué pasa si se intenta registrar un correo repetido?**
La columna `email` tiene una restricción `UNIQUE`. MySQL devuelve el error `ER_DUP_ENTRY` y el backend responde **409** con un mensaje comprensible.

**15. ¿Dónde se validan los datos?**
En el frontend para dar respuesta rápida al usuario y en el backend porque la validación del servidor es la definitiva; el frontend puede ser manipulado.

**16. ¿Qué es una SPA?**
Una aplicación de una sola página que cambia de vista con JavaScript sin recargar todo el documento.

**17. ¿Cómo funciona React Router?**
`BrowserRouter` usa la API de historial del navegador. `Routes` y `Route` deciden qué componente mostrar según la URL, y `Link` navega sin recargar.

**18. ¿Diferencia entre `Link` y una etiqueta `<a>`?**
`Link` de React Router intercepta el clic y cambia la ruta sin recargar; `<a href>` provoca una petición completa al servidor.

**19. ¿Qué hace `useState`?**
Declara una variable de estado. Al actualizarla, React vuelve a renderizar el componente con el nuevo valor.

**20. ¿Qué hace `event.preventDefault()`?**
Evita la acción por defecto del formulario, que sería enviar y recargar la página.

**21. ¿Qué es un formulario controlado?**
Un formulario cuyos campos reciben su valor del estado de React (`value`) y lo actualizan con `onChange`.

**22. ¿Cómo se conecta Express con MySQL?**
Mediante el pool exportado por `config/database.js`. Los controladores importan el pool y ejecutan consultas con `execute()`.

**23. ¿Qué pasa si MySQL está apagado?**
El backend inicia con una advertencia, `/api/health` responde **503** con `database: "disconnected"`, las rutas CRUD responden **500** y el frontend muestra un mensaje de error de conexión.

**24. ¿Por qué el archivo `.env` no se sube a Git?**
Porque contiene credenciales locales. Se sube `.env.example` como plantilla y `.env` se excluye con `.gitignore`.

**25. ¿Qué es una API REST?**
Una interfaz que expone recursos mediante rutas HTTP y métodos como GET, POST, PUT y DELETE, normalmente intercambiando JSON.

**26. ¿Por qué se separó en rutas, controladores y configuración?**
Para mantener el código organizado: las rutas definen las URLs, los controladores contienen la lógica y la configuración centraliza la conexión a la base.

---

## 10. Guion para una demostración de 3 a 5 minutos

> Antes de empezar: backend y frontend en ejecución, MySQL encendido y una pestaña con MySQL Workbench lista.

### 0:00 – 0:30 | Presentación

- Saludo y nombre del proyecto.
- Objetivo: registrar, consultar, actualizar y eliminar usuarios.
- Tecnologías: React, Node.js, Express y MySQL.
- Mostrar rápidamente la pantalla de inicio.

### 0:30 – 1:00 | Estado del sistema

- Abrir `http://localhost:3000/api/health`.
- Señalar `"database": "connected"`.
- Explicar en una frase: «Express se conecta a MySQL mediante un pool y responde JSON».

### 1:00 – 1:45 | Registrar un usuario

- Ir a **Registrar**.
- Escribir un nombre y un correo nuevos.
- Mencionar que el formulario es controlado: `value`, `onChange`, `useState`.
- Pulsar **Registrar usuario**.
- Mostrar el mensaje de éxito y el formulario limpio.
- Señalar que el navegador no se recargó.

### 1:45 – 2:30 | Consultar y editar

- Ir a **Usuarios**.
- Mostrar la fila con ID, nombre, correo y fecha.
- Pulsar **Editar**.
- Cambiar el nombre o el correo.
- Pulsar **Guardar cambios**.
- Mostrar el mensaje y la fila actualizada.

### 2:30 – 3:15 | Eliminar y comprobar en MySQL

- Pulsar **Eliminar** y aceptar la confirmación.
- Mostrar que la fila desapareció y el mensaje de confirmación.
- En MySQL Workbench ejecutar:

  ```sql
  SELECT * FROM users ORDER BY id;
  ```

- Señalar que solo se borró el registro de prueba.

### 3:15 – 4:15 | Explicación técnica breve

- Mostrar el controlador y una consulta:

  ```javascript
  await pool.execute(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, userId]
  );
  ```

- Explicar los `?` y la prevención de inyección SQL.
- Explicar el recorrido: React → fetch → Express → controlador → pool → MySQL → JSON → React.
- Mencionar que la navegación usa `BrowserRouter`, `Routes`, `Route` y `Link`.

### 4:15 – 4:45 | Cierre

- Conclusión: el CRUD funciona de extremo a extremo.
- Recomendación aprendida: validar en el backend y usar consultas parametrizadas.
- Agradecer y ofrecer turno de preguntas.

### Consejos para la demo

- Ensayar al menos dos veces con datos nuevos.
- No usar correos ya registrados.
- Tener MySQL Workbench abierto antes de empezar.
- Si falla la conexión, revisar primero que MySQL esté encendido y que el backend esté corriendo.
- No afirmar que algo se guardó hasta ver el mensaje de éxito o el registro en MySQL.

---

## 11. Distribución sugerida de responsabilidades

> Reemplazar «Integrante 1/2/3» por los nombres reales del grupo. La distribución es una sugerencia; todos deben comprender y poder explicar el sistema completo.

### Para 2 integrantes

| Responsabilidad | Integrante 1 | Integrante 2 |
|---|---|---|
| Base de datos y esquema | Principal | Apoyo |
| Conexión MySQL y pool | Principal | Apoyo |
| Controladores y rutas Express | Principal | Apoyo |
| Pruebas de la API | Apoyo | Principal |
| Componentes React y CSS | Apoyo | Principal |
| React Router y SPA | Apoyo | Principal |
| Formulario controlado | Apoyo | Principal |
| README y evidencias | Apoyo | Principal |
| Guía de sustentación | Principal | Apoyo |
| Demostración | Ambas partes | Ambas partes |

**Integrante 1 (completar nombre):** ______________________________________

**Integrante 2 (completar nombre):** ______________________________________

### Para 3 integrantes

| Responsabilidad | Integrante 1 | Integrante 2 | Integrante 3 |
|---|---|---|---|
| Creación de la base de datos | Principal | Apoyo | — |
| `config/database.js` y `.env` | Principal | Apoyo | — |
| Controladores y validaciones | Apoyo | Principal | — |
| Rutas y `server.js` | Apoyo | Principal | — |
| Pruebas CRUD de la API | Apoyo | Principal | Apoyo |
| Componentes y formularios React | — | Apoyo | Principal |
| React Router y navegación SPA | — | Apoyo | Principal |
| Estilos y diseño responsive | — | — | Principal |
| README, evidencias y guía | Apoyo | Apoyo | Principal |
| Sustentación | Parte del flujo | Parte del flujo | Parte del flujo |

**Integrante 1 (completar nombre):** ______________________________________

**Integrante 2 (completar nombre):** ______________________________________

**Integrante 3 (completar nombre):** ______________________________________

### Recomendación para todos

Cada integrante debe poder responder:

1. ¿Qué ocurre desde que se pulsa «Registrar» hasta que el dato llega a MySQL?
2. ¿Dónde está la consulta SQL y por qué usa `?`.
3. ¿Cómo se navega entre vistas sin recargar?
4. ¿Qué validaciones existen y dónde se aplican?
5. ¿Qué se muestra si MySQL está apagado?

---

## 12. Plantilla para la PARTE I teórica

> **No se incluyen respuestas inventadas.** Esta sección debe completarse con las preguntas exactas entregadas por el docente y las diapositivas del curso.

### Datos del grupo

- Integrantes: ______________________________________________________
- Sección / grupo: __________________________________________________
- Fecha: ___________________________________________________________

### Registro de preguntas y respuestas

| N.º | Pregunta del docente | Respuesta elaborada por el grupo | Fuente (diapositiva / sesión) |
|---|---|---|---|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |
| 4 |  |  |  |
| 5 |  |  |  |
| 6 |  |  |  |
| 7 |  |  |  |
| 8 |  |  |  |
| 9 |  |  |  |
| 10 |  |  |  |

### Temas que probablemente aborde la PARTE I

Verificar en las diapositivas antes de responder:

- Definición y función de Node.js.
- Función de npm y del archivo `package.json`.
- Diferencia entre JavaScript en el navegador y en el servidor.
- Qué es Express y qué es un middleware.
- Métodos HTTP y códigos de estado.
- Qué es una base de datos relacional y qué es una clave primaria.
- Restricción `UNIQUE` y manejo de duplicados.
- Consultas parametrizadas y prevención de inyección SQL.
- Qué es un pool de conexiones.
- Variables de entorno y archivo `.env`.
- Qué es React, JSX y un componente.
- Estado (`useState`) y formulario controlado.
- Qué es una SPA y cómo funciona React Router.
- Recorrido completo de una petición en el proyecto.

---

## 13. Lista de verificación antes de sustentar

- [ ] MySQL está encendido.
- [ ] `backend/.env` tiene los datos correctos.
- [ ] El backend responde en `http://localhost:3000/api/health`.
- [ ] El frontend abre en `http://localhost:5173`.
- [ ] Se pueden registrar, listar, editar y eliminar usuarios.
- [ ] La base no contiene correos de prueba duplicados.
- [ ] Las capturas de `evidencias/` están completas.
- [ ] El README está actualizado.
- [ ] Los nombres de los integrantes están completados.
- [ ] Todos ensayaron la demostración.
- [ ] Se sabe explicar el recorrido React → Express → MySQL → Express → React.
- [ ] Se sabe explicar por qué se usan `execute()` y los signos `?`.
- [ ] Se sabe explicar `useState`, `value`, `onChange`, `onSubmit` y `preventDefault`.
