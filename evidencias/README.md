# Evidencias del proyecto

Esta carpeta contiene únicamente evidencias **reales** del funcionamiento del sistema.

## Capturas ya incluidas

| Archivo | Qué demuestra |
|---|---|
| `07-formulario-react.png` | Formulario de registro diligenciado con nombre y correo. |
| `07b-registro-exitoso.png` | Mensaje de éxito del backend y formulario limpio después del registro. |
| `08-navegacion-spa.png` | Vista de usuarios con el registro creado y los botones Editar/Eliminar. |
| `08b-edicion-react.png` | Vista de edición cargada con los datos actuales del usuario. |
| `pruebas-api.txt` | Resultado real de las 14 pruebas automáticas de la API. |

Estas capturas se obtuvieron con un navegador real durante las pruebas del proyecto. El registro mostrado fue eliminado al finalizar la prueba.

## Capturas que debe tomar el estudiante

No se generaron imágenes ficticias ni archivos vacíos. Las siguientes capturas requieren MySQL Workbench, Postman/Thunder Client o una terminal visible.

### `01-entorno-node-npm.png`

1. Abrir PowerShell o CMD.
2. Ejecutar:

   ```bash
   node -v
   npm -v
   ```

3. Tomar una captura donde se vean los dos comandos y sus versiones.

### `02-base-datos-mysql.png`

1. Abrir MySQL Workbench.
2. Conectarse a la instancia local.
3. Actualizar el panel de esquemas.
4. Expandir `sistema_usuarios` → `Tables` → `users`.
5. Tomar una captura donde se vea la base y la tabla.

También puede mostrar la salida de:

```sql
USE sistema_usuarios;
SHOW TABLES;
DESCRIBE users;
```

### `03-create-post.png`

1. Abrir Postman o Thunder Client.
2. Crear una petición **POST** a `http://localhost:3000/api/users`.
3. En **Body → raw → JSON**, enviar:

   ```json
   {
     "name": "Usuario de Prueba",
     "email": "evidencia@example.com"
   }
   ```

4. Enviar y capturar la respuesta **201** con el usuario creado.

### `04-read-get.png`

1. Crear una petición **GET** a `http://localhost:3000/api/users`.
2. Enviar y capturar la respuesta **200** con el arreglo de usuarios.
3. Opcionalmente, repetir con `GET http://localhost:3000/api/users/1` para mostrar la consulta por ID.

### `05-update-put.png`

1. Crear una petición **PUT** a `http://localhost:3000/api/users/1` (usar el ID real del usuario de prueba).
2. Enviar:

   ```json
   {
     "name": "Usuario de Prueba Actualizado",
     "email": "evidencia.actualizada@example.com"
   }
   ```

3. Capturar la respuesta **200** con los datos modificados.

### `06-delete.png`

1. Crear una petición **DELETE** a `http://localhost:3000/api/users/1` (usar el ID real).
2. Capturar la respuesta **200** con el mensaje de eliminación.
3. Hacer un **GET** al mismo ID y capturar el **404** que confirma que ya no existe.

### `09-registro-en-mysql.png`

1. Registrar un usuario desde el formulario de React (por ejemplo, `evidencia@example.com`).
2. Abrir MySQL Workbench o la consola de MySQL.
3. Ejecutar:

   ```sql
   USE sistema_usuarios;
   SELECT id, name, email, created_at FROM users ORDER BY id;
   ```

4. Capturar la fila del usuario creado desde la interfaz.

> Para no dejar datos de prueba, eliminarlo al final desde la propia interfaz o con:
>
> ```sql
> DELETE FROM users WHERE email = 'evidencia@example.com';
> ```

## Recomendaciones

- Guardar todas las imágenes en esta carpeta con los nombres indicados.
- Verificar que el texto de las capturas sea legible.
- No mostrar contraseñas, tokens ni el contenido completo del archivo `.env`.
- No usar capturas de otros proyectos ni resultados inventados.
