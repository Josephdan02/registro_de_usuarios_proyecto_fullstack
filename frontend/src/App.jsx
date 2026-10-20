import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RegisterUserPage from './pages/RegisterUserPage';
import UsersPage from './pages/UsersPage';
import EditUserPage from './pages/EditUserPage';

function NotFoundPage() {
  return (
    <section className="page">
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">
          🔎
        </span>
        <h1>Página no encontrada</h1>
        <p>La dirección que ingresaste no existe dentro del sistema.</p>
        <Link className="btn btn-primary" to="/">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <div className="container header-inner">
            <Link className="brand" to="/">
              <span className="brand-mark" aria-hidden="true">
                RU
              </span>
              <span>
                Registro de Usuarios
                <small>Sistema Fullstack</small>
              </span>
            </Link>

            <nav className="main-nav" aria-label="Navegación principal">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
              <Link className="nav-link" to="/register">
                Registrar
              </Link>
              <Link className="nav-link" to="/users">
                Usuarios
              </Link>
            </nav>
          </div>
        </header>

        <main className="site-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegisterUserPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:id/edit" element={<EditUserPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>

        <footer className="site-footer">
          <div className="container footer-inner">
            <p>Proyecto grupal integrador · Fullstack Developer Software · SENATI</p>
            <p className="footer-tech">React · Node.js · Express · MySQL</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
