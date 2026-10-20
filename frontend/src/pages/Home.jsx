import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">Proyecto Fullstack · SENATI</span>
          <h1>Gestiona el registro de usuarios de forma simple y segura.</h1>
          <p>
            Sistema web para registrar, consultar, actualizar y eliminar usuarios.
            El frontend en React se comunica con una API en Node.js y Express, y los
            datos se guardan en MySQL.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/register">
              Registrar usuario
            </Link>
            <Link className="btn btn-secondary" to="/users">
              Ver usuarios
            </Link>
          </div>
        </div>

        <div className="hero-panel" aria-label="Operaciones disponibles">
          <p className="panel-title">Operaciones CRUD</p>
          <ul>
            <li>
              <span className="panel-letter">C</span>
              <div>
                <strong>Crear</strong>
                <small>Registra nombre y correo.</small>
              </div>
            </li>
            <li>
              <span className="panel-letter">R</span>
              <div>
                <strong>Leer</strong>
                <small>Consulta todos los usuarios.</small>
              </div>
            </li>
            <li>
              <span className="panel-letter">U</span>
              <div>
                <strong>Actualizar</strong>
                <small>Edita los datos de un usuario.</small>
              </div>
            </li>
            <li>
              <span className="panel-letter">D</span>
              <div>
                <strong>Eliminar</strong>
                <small>Borra un registro confirmado.</small>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="features" aria-labelledby="features-title">
        <div className="section-heading">
          <span className="eyebrow">Tecnologías del proyecto</span>
          <h2 id="features-title">Cada capa cumple una función clara</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-icon" aria-hidden="true">
              ⚛️
            </span>
            <h3>React</h3>
            <p>
              Construye la interfaz con componentes, formularios controlados y
              navegación SPA mediante React Router.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-icon" aria-hidden="true">
              🟢
            </span>
            <h3>Node.js + Express</h3>
            <p>
              Ejecuta JavaScript en el servidor y expone las rutas de la API REST
              que reciben y validan las peticiones.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-icon" aria-hidden="true">
              🛢️
            </span>
            <h3>MySQL</h3>
            <p>
              Almacena los usuarios en una tabla con identificador único y correo
              electrónico único.
            </p>
          </article>
        </div>
      </section>

      <section className="flow-section" aria-labelledby="flow-title">
        <div>
          <span className="eyebrow">Recorrido de una petición</span>
          <h2 id="flow-title">De React a MySQL y de regreso</h2>
          <p>
            Al enviar el formulario, React hace una petición <code>fetch</code> a
            Express. El controlador valida los datos, ejecuta una consulta
            parametrizada y MySQL guarda el registro. La respuesta vuelve como JSON
            y la interfaz se actualiza sin recargar la página.
          </p>
        </div>

        <ol className="flow-list">
          <li>
            <span>1</span> Formulario controlado en React
          </li>
          <li>
            <span>2</span> Petición HTTP con fetch
          </li>
          <li>
            <span>3</span> Ruta y controlador de Express
          </li>
          <li>
            <span>4</span> Consulta SQL con mysql2
          </li>
          <li>
            <span>5</span> Respuesta JSON y actualización de la vista
          </li>
        </ol>
      </section>
    </>
  );
}

export default Home;
