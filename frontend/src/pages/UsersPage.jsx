import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserList from '../components/UserList';
import { deleteUser, getUsers } from '../services/userService';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Muestra el mensaje enviado desde la vista de edición y limpia el estado de navegación.
  useEffect(() => {
    if (location.state?.message) {
      setMessage({ type: 'success', text: location.state.message });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getUsers();
      setUsers(result.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleDelete(user) {
    const confirmed = window.confirm(
      `¿Eliminar a ${user.name} (${user.email})? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(user.id);
    setMessage(null);

    try {
      const result = await deleteUser(user.id);
      setUsers((previous) => previous.filter((item) => item.id !== user.id));
      setMessage({ type: 'success', text: result.message });
    } catch (requestError) {
      setMessage({ type: 'error', text: requestError.message });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Consulta de datos</span>
          <h1>Usuarios registrados</h1>
          <p>Consulta, edita o elimina los usuarios almacenados en MySQL.</p>
        </div>
        <Link className="btn btn-primary" to="/register">
          + Registrar usuario
        </Link>
      </header>

      {message && (
        <div className={`alert alert-${message.type}`} role="status" aria-live="polite">
          <span>{message.text}</span>
        </div>
      )}

      <div className="list-card">
        <div className="list-toolbar">
          <span className="count-badge">
            {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={loadUsers}
            disabled={loading}
          >
            Actualizar lista
          </button>
        </div>

        {loading && (
          <div className="loading-state" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <p>Cargando usuarios...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
            <button className="alert-link" type="button" onClick={loadUsers}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <UserList users={users} onDelete={handleDelete} deletingId={deletingId} />
        )}
      </div>
    </section>
  );
}

export default UsersPage;
