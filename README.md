# Sistema de Registro de Usuarios

Proyecto grupal integrador del curso **Fullstack Developer Software** (V ciclo, SENATI).
Tema: **Uso del entorno de ejecución backend con JavaScript**.

## 1. Objetivo

Construir un sistema web funcional que permita **registrar, consultar, actualizar y eliminar usuarios** mediante:

- Una interfaz SPA desarrollada con **React**.
- Una API REST desarrollada con **Node.js + Express**.
- Una base de datos **MySQL** consultada con SQL directo y consultas parametrizadas.

El sistema permite demostrar el recorrido completo de una petición: React envía datos con `fetch`, Express los valida, `mysql2/promise` ejecuta la consulta, MySQL almacena o devuelve la información y React actualiza la pantalla sin recargar la página.

---

## 2. Tecnologías utilizadas

| Tecnología | Función dentro del proyecto |
|---|---|
| **Node.js** | Ejecuta JavaScript fuera del navegador; es el entorno del backend. |
| **npm** | Instala dependencias y ejecuta los scripts de `package.json`. |
| **Express** | Crea el servidor HTTP, define las rutas y los middlewares. |
| **mysql2 / mysql2/promise** | Permite ejecutar consultas en MySQL desde Node.js usando promesas (`async/await`). |
| **dotenv** | Carga las credenciales y la configuración desde el archivo `.env`. |
| **cors** | Permite que el frontend (`localhost:5173`) llame al backend (`localhost:3000`), que está en otro puerto. |
| **MySQL 8** | Guarda los usuarios en la base de datos `sistema_usuarios`. |
| **React 18** | Construye la interfaz mediante componentes y estado. |
| **React Router DOM 7** | Gestiona la navegación SPA sin recargar la página. |
| **Vite** | Sirve el frontend en desarrollo y genera la versión de producción. |
| **CSS convencional** | Da estilo y adaptabilidad a la interfaz, sin librerías de diseño. |

Versiones verificadas en este equipo:

```text
Node.js  v22.23.2
npm      10.9.8
MySQL    8.0.30 (Laragon)
```

Las versiones de las dependencias están registradas en cada `package.json` y en `package-lock.json`.

---

## 3. Requisitos previos

1. **Node.js LTS** y npm instalados. Comprobar con:

   ```bash
   node -v
   npm -v
   ```

2. **MySQL 8** instalado y en ejecución. Puede ser una instalación independiente o la incluida en Laragon/XAMPP.
3. Un editor de código (VS Code recomendado) y, opcionalmente, MySQL Workbench.
4. Puertos disponibles: **3000** para el backend y **5173** para el frontend.

> Si Node.js no está instalado, descargar la versión LTS desde <https://nodejs.org/> y verificar de nuevo con `node -v`.

---

## 4. Estructura del proyecto

```text
registro_de_usuarios_proyecto_fullstack/
├── backend/
│   ├── config/
│   │   └── database.js          # Pool de conexiones a MySQL
│   ├── controllers/
│   │   └── userController.js    # Lógica del CRUD y validaciones
│   ├── routes/
│   │   └── userRoutes.js        # Rutas /api/users
│   ├── .env                     # Credenciales locales (NO se sube a Git)
│   ├── .env.example             # Plantilla sin credenciales reales
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js                # Servidor Express y /api/health
│   └── test-api.js              # Prueba automática del CRUD
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserForm.jsx     # Formulario controlado reutilizable
│   │   │   └── UserList.jsx     # Tabla de usuarios
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── RegisterUserPage.jsx
│   │   │   ├── UsersPage.jsx
│   │   │   └── EditUserPage.jsx
│   │   ├── services/
│   │   │   └── userService.js   # Llamadas fetch centralizadas
│   │   ├── App.jsx              # Rutas y navegación SPA
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                     # URL local de la API (NO se sube a Git)
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── database/
│   └── schema.sql               # Base de datos y tabla users
├── docs/
│   └── guia_sustentacion.md
├── evidencias/
│   ├── 07-formulario-react.png
│   ├── 07b-registro-exitoso.png
│   ├── 08-navegacion-spa.png
│   ├── 08b-edicion-react.png
│   ├── pruebas-api.txt
│   └── README.md                # Capturas que faltan y cómo obtenerlas
├── .gitignore
└── README.md
```

La carpeta `frontend/dist/` y los `node_modules/` se generan automáticamente y están excluidos de Git.

---

## 5. Creación de la base de datos

El archivo `database/schema.sql` crea la base y la tabla **sin borrar datos existentes** (`CREATE ... IF NOT EXISTS`).

### Opción A: MySQL Workbench

1. Abrir MySQL Workbench y conectarse a la instancia local.
2. Ir a **File → Open SQL Script** y seleccionar `database/schema.sql`.
3. Ejecutar todo el script con el botón del rayo.
4. Actualizar el panel de esquemas: debe aparecer `sistema_usuarios` con la tabla `users`.

### Opción B: consola de MySQL (CMD)

```bat
cd C:\laragon\www\registro_de_usuarios_proyecto_fullstack
"C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysql.exe" -u root -p < database\schema.sql
```

### Opción C: consola de MySQL desde PowerShell

```powershell
cd C:\laragon\www\registro_de_usuarios_proyecto_fullstack
Get-Content .\database\schema.sql | & "C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysql.exe" -u root -p
```

> Si `mysql` ya está agregado al PATH, se puede usar directamente `mysql -u root -p`.
> La ruta de Laragon puede variar según la versión instalada.

### Verificación

```sql
USE sistema_usuarios;
SHOW TABLES;
DESCRIBE users;
SELECT * FROM users;
```

Estructura esperada:

| Campo | Tipo | Restricción |
|---|---|---|
| `id` | `INT UNSIGNED` | PK, autoincremental |
| `name` | `VARCHAR(100)` | obligatorio |
| `email` | `VARCHAR(150)` | obligatorio y único |
| `created_at` | `TIMESTAMP` | valor por defecto: fecha y hora actual |

---

## 6. Configuración del archivo `.env`

### Backend

```powershell
cd backend
Copy-Item .env.example .env
```

Editar `backend/.env` con los datos locales:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contrasena_local
DB_NAME=sistema_usuarios
PORT=3000
```

- En una instalación de Laragon, el usuario suele ser `root` y la contraseña puede estar vacía. **No se debe asumir**: comprobar la configuración propia.
- El archivo `.env` real está excluido por `.gitignore`.
- El archivo `.env.example` no contiene contraseñas reales.

### Frontend

```powershell
cd frontend
Copy-Item .env.example .env
```

Contenido:

```env
VITE_API_URL=http://localhost:3000/api
```

Vite solo expone al navegador las variables que comienzan con `VITE_`.

---

## 7. Instalación de dependencias

### Backend

```powershell
cd backend
npm install
```

Dependencias principales: `express`, `mysql2`, `dotenv` y `cors`.

### Frontend

```powershell
cd frontend
npm install
```

Dependencias principales: `react`, `react-dom`, `react-router-dom`, `vite` y `@vitejs/plugin-react`.

### ¿Qué es `package.json`?

Es el archivo que describe el proyecto: su nombre, versión, scripts y dependencias. npm lo usa para saber qué instalar y qué comando ejecutar. `package-lock.json` fija las versiones exactas instaladas para que el proyecto sea reproducible.

### ¿Qué hacen Node.js y npm?

- **Node.js** es el entorno que ejecuta JavaScript en el servidor.
- **npm** es el gestor de paquetes: descarga librerías y ejecuta los scripts definidos en `package.json`.

---

## 8. Ejecución del backend

```powershell
cd backend
npm start
```

También se puede usar `npm run dev` (ambos ejecutan `node server.js`).

Salida esperada:

```text
Conexión con MySQL verificada correctamente.
API de usuarios escuchando en http://localhost:3000
Estado del servidor: http://localhost:3000/api/health
```

Comprobar el estado:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "Servidor y base de datos disponibles.",
  "data": { "server": "ok", "database": "connected" }
}
```

---

## 9. Ejecución del frontend

En otra terminal:

```powershell
cd frontend
npm run dev
```

Abrir <http://localhost:5173>.

Para comprobar la compilación de producción:

```powershell
npm run build
npm run preview
```

> El backend debe estar en ejecución para que las vistas de usuarios funcionen.

---

## 10. Pruebas de las rutas CRUD

### Formato de respuesta

Todas las rutas usan un formato coherente:

```json
{
  "success": true,
  "message": "Descripción del resultado.",
  "data": {}
}
```

En errores, `success` es `false`, se incluye `message` y se usa el código HTTP adecuado: **400** validación, **404** no encontrado, **409** correo duplicado, **500** error interno.

### Rutas disponibles

| Método | Ruta | Operación | Éxito |
|---|---|---|---|
| GET | `/api/users` | Listar todos los usuarios | 200 |
| GET | `/api/users/:id` | Consultar un usuario por ID | 200 |
| POST | `/api/users` | Crear un usuario | 201 |
| PUT | `/api/users/:id` | Actualizar un usuario | 200 |
| DELETE | `/api/users/:id` | Eliminar un usuario | 200 |
| GET | `/api/health` | Estado del servidor y MySQL | 200 / 503 |

### Prueba automática (recomendada)

Con el backend en ejecución:

```powershell
cd backend
npm test
```

El script `test-api.js` crea un usuario de prueba, lo consulta, lo actualiza, intenta duplicarlo, valida errores y finalmente lo elimina. **No toca otros registros.**

Resultado real obtenido en este equipo:

```text
[OK] GET /health responde 200 y MySQL conectado
[OK] GET /api/users responde 200 con un arreglo
[OK] POST sin datos responde 400
[OK] POST con correo inválido responde 400
[OK] POST registra el usuario y responde 201
[OK] POST con correo duplicado responde 409
[OK] GET /api/users/:id encuentra el usuario creado
[OK] GET con ID no numérico responde 400
[OK] GET con ID inexistente responde 404
[OK] PUT actualiza el usuario y responde 200
[OK] PUT con ID inexistente responde 404
[OK] DELETE elimina el usuario y responde 200
[OK] GET después de DELETE responde 404
[OK] DELETE repetido responde 404

Resultado: 14 pruebas correctas, 0 fallidas.
```

La salida también está guardada en `evidencias/pruebas-api.txt`.

### Pruebas manuales con PowerShell

**Crear (POST):**

```powershell
$body = @{
  name  = "Usuario de Prueba"
  email = "prueba@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users" `
  -Method Post -ContentType "application/json" -Body $body
```

**Listar (GET):**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Get
```

**Consultar por ID (GET):**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method Get
```

**Actualizar (PUT):**

```powershell
$body = @{
  name  = "Usuario de Prueba Actualizado"
  email = "prueba.actualizada@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" `
  -Method Put -ContentType "application/json" -Body $body
```

**Eliminar (DELETE):**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method Delete
```

**Validaciones que deben fallar:**

```powershell
# Datos vacíos -> 400
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Post `
  -ContentType "application/json" -Body '{"name":"","email":""}'

# Correo con formato inválido -> 400
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Post `
  -ContentType "application/json" -Body '{"name":"Ana","email":"correo-invalido"}'

# ID inexistente -> 404
Invoke-RestMethod -Uri "http://localhost:3000/api/users/99999999" -Method Get
```

> En PowerShell, los errores HTTP se muestran como excepciones. El mensaje JSON de la respuesta se puede revisar con herramientas como Postman, Thunder Client o la pestaña Network del navegador.

### Comprobar directamente en MySQL

```sql
USE sistema_usuarios;
SELECT id, name, email, created_at FROM users ORDER BY id;
```

Para eliminar únicamente el registro de prueba:

```sql
DELETE FROM users WHERE email = 'prueba@example.com';
```

No se deben borrar datos reales ni ejecutar `DROP DATABASE` / `DROP TABLE`.

---

## 11. Evidencias

### Capturas reales ya incluidas

| Archivo | Contenido verificado |
|---|---|
| `evidencias/07-formulario-react.png` | Formulario de registro con nombre y correo escritos. |
| `evidencias/07b-registro-exitoso.png` | Mensaje de éxito y formulario limpio después de guardar. |
| `evidencias/08-navegacion-spa.png` | Listado con el usuario recién registrado y sus acciones. |
| `evidencias/08b-edicion-react.png` | Formulario de edición cargado con los datos actuales. |
| `evidencias/pruebas-api.txt` | Salida real de las 14 pruebas de la API. |

### Capturas que debe tomar el estudiante

Las siguientes capturas requieren la interfaz gráfica de MySQL Workbench, Postman/Thunder Client o una terminal visible. **No se generaron imágenes ficticias.** El detalle está en `evidencias/README.md`.

| Archivo pendiente | Qué debe mostrar |
|---|---|
| `01-entorno-node-npm.png` | Terminal con `node -v` y `npm -v`. |
| `02-base-datos-mysql.png` | MySQL Workbench con la base `sistema_usuarios` y la tabla `users`. |
| `03-create-post.png` | Petición POST a `/api/users` con respuesta 201. |
| `04-read-get.png` | Petición GET a `/api/users` o `/api/users/:id` con respuesta 200. |
| `05-update-put.png` | Petición PUT y respuesta 200 con los datos modificados. |
| `06-delete.png` | Petición DELETE y comprobación de que el registro ya no existe. |
| `09-registro-en-mysql.png` | Consulta `SELECT * FROM users;` mostrando un usuario registrado desde React. |

---

## 12. Recorrido React → Express → MySQL → Express → React

1. El usuario escribe el nombre y el correo en el formulario de React.
2. `onChange` actualiza el estado del componente en cada pulsación.
3. Al enviar, `onSubmit` ejecuta `event.preventDefault()` y evita la recarga.
4. `userService.js` envía los datos con `fetch` como JSON al backend.
5. Express recibe la petición gracias a `express.json()`.
6. La ruta `/api/users` llama al controlador `createUser`.
7. El controlador valida el nombre y el correo.
8. `pool.execute()` ejecuta el `INSERT` parametrizado.
9. MySQL guarda el registro y devuelve el ID generado.
10. Express responde con estado **201** y un JSON con el usuario creado.
11. React recibe la respuesta, muestra el mensaje de éxito y limpia el formulario.
12. La lista se actualiza al consultar nuevamente `GET /api/users`.

El mismo recorrido se repite para listar, consultar por ID, actualizar y eliminar.

---

## 13. Consultas parametrizadas y el signo `?`

Ejemplo del proyecto:

```javascript
const [result] = await pool.execute(
  'INSERT INTO users (name, email) VALUES (?, ?)',
  [name, email]
);
```

- Los signos `?` son **marcadores de posición**.
- `mysql2` envía la consulta y los valores por separado.
- El controlador no concatena los datos del usuario dentro del SQL.
- Esto evita inyecciones SQL y permite que el driver escape correctamente los valores.
- El orden del arreglo debe coincidir con el orden de los `?`.

Las cuatro consultas principales son:

```javascript
// CREATE
'INSERT INTO users (name, email) VALUES (?, ?)'

// READ
'SELECT * FROM users WHERE id = ?'

// UPDATE
'UPDATE users SET name = ?, email = ? WHERE id = ?'

// DELETE
'DELETE FROM users WHERE id = ?'
```

El ID también se valida antes de usarlo: debe ser un entero positivo.

---

## 14. SPA y React Router

Una **SPA** (Single Page Application) carga una sola página HTML y cambia el contenido mediante JavaScript, sin recargar todo el documento.

En este proyecto:

- `BrowserRouter` envuelve la aplicación.
- `Routes` contiene las rutas.
- `Route` asocia una URL con un componente.
- `Link` permite navegar entre vistas sin recargar.
- `useNavigate` redirige después de guardar una edición.
- `useParams` obtiene el `:id` de la URL en la vista de edición.
- `useLocation` transporta un mensaje de éxito desde la edición hacia la lista.

Rutas de la aplicación:

| URL | Vista |
|---|---|
| `/` | Inicio |
| `/register` | Registrar usuario |
| `/users` | Lista de usuarios |
| `/users/:id/edit` | Editar usuario |

Se verificó en un navegador real que una variable creada en `window` se conserva al navegar entre vistas, lo que demuestra que **no hay recarga completa de la página**. También se comprobó que no hay errores en consola ni peticiones fallidas.

---

## 15. Formulario controlado

El componente `UserForm.jsx` implementa los elementos exigidos:

- `useState` guarda `values` y `errors`.
- Cada input tiene `value={values.name}` o `value={values.email}`.
- `onChange` actualiza el estado con `setValues`.
- El formulario usa `onSubmit={handleSubmit}`.
- `handleSubmit` ejecuta `event.preventDefault()` antes de llamar a la API.
- Se valida el nombre obligatorio, el correo obligatorio y su formato.
- Si el backend responde correctamente, el formulario de registro se limpia (`resetOnSuccess`).
- Si hay error, se muestra el mensaje devuelto por el servidor y no se borran los datos escritos.

Flujo resumido:

```text
onChange → estado de React → onSubmit → preventDefault → fetch → Express →
validación → pool.execute() → MySQL → respuesta JSON → mensaje en pantalla
```

---

## 16. Problemas comunes y soluciones

| Problema | Causa probable | Solución |
|---|---|---|
| `ECONNREFUSED` al iniciar el backend | MySQL no está en ejecución. | Iniciar MySQL desde Laragon, XAMPP o el servicio de Windows. |
| `ER_ACCESS_DENIED_ERROR` | Usuario o contraseña incorrectos. | Revisar `DB_USER` y `DB_PASSWORD` en `backend/.env`. |
| `ER_BAD_DB_ERROR` | La base no existe. | Ejecutar `database/schema.sql`. |
| `EADDRINUSE` en el puerto 3000 | Otro proceso usa el puerto. | Cerrar el proceso o cambiar `PORT` en `.env` y `VITE_API_URL`. |
| El frontend muestra error de conexión | El backend no está encendido o la URL es incorrecta. | Ejecutar `npm start` en `backend` y revisar `frontend/.env`. |
| Error de CORS | El backend no permite el origen del frontend. | Mantener `app.use(cors())` y usar `http://localhost:5173`. |
| Correo duplicado (409) | El correo ya existe y la columna es `UNIQUE`. | Usar otro correo o editar el registro existente. |
| `mysql` no se reconoce como comando | La carpeta `bin` no está en el PATH. | Usar la ruta completa del ejecutable de MySQL. |
| Acentos o ñ mal mostrados | Codificación incorrecta. | La base usa `utf8mb4`; guardar los archivos en UTF-8. |
| `npm` bloqueado por políticas de PowerShell | Restricción de scripts del sistema. | Usar `npm.cmd` o ajustar la política de ejecución con el administrador. |
| La tabla aparece vacía | No hay registros o el backend apunta a otra base. | Revisar `DB_NAME` y ejecutar `SELECT * FROM users;`. |

---

## 17. Conclusiones

- Se implementó un sistema fullstack funcional con las cuatro operaciones CRUD.
- Node.js y Express permiten exponer una API REST sencilla y organizada por rutas, controladores y configuración.
- MySQL almacena los datos y las consultas parametrizadas protegen la aplicación de inyecciones SQL.
- El pool de conexiones reutiliza conexiones y mejora el rendimiento frente a abrir una conexión por petición.
- React permite construir una interfaz dinámica con formularios controlados y navegación SPA.
- React Router mantiene la experiencia de una sola página sin recargas completas.
- Las validaciones se aplican tanto en el frontend como en el backend; la validación del servidor es la definitiva.
- Las pruebas reales confirmaron el funcionamiento del CRUD, los códigos HTTP y el registro en MySQL.

---

## Nota sobre los integrantes

Los nombres de los integrantes del grupo deben completarse en la carátula del informe y en la guía de sustentación. No se inventaron nombres ni se atribuyeron tareas individuales no confirmadas.
