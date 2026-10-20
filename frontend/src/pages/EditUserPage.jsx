import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { getUserById, updateUser } from '../services/userService';

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null);

  const loadUser = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getUserById(id);
      setUser(result.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function handleUpdate(values) {
    setSaving(true);
    setMessage(null);

    try {
      const result = await updateUser(id, values);
      navigate('/users', { state: { message: result.message } });
      return true;
    } catch (requestError) {
      setMessage({ type: 'error', text: requestError.message });
      return false;
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Actualizar registro</span>
          <h1>Editar usuario</h1>
          <p>Modifica el nombre o el correo y guarda los cambios.</p>
        </div>
        <Link className="btn btn-secondary" to="/users">
          Volver a la lista
        </Link>
      </header>

      {loading && (
        <div className="loading-state" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <p>Cargando datos del usuario...</p>
        </div>
      )}

      {!loading && error && (
        <div className="form-card">
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
          </div>
          <div className="inline-actions">
            <button className="btn btn-secondary" type="button" onClick={loadUser}>
              Reintentar
            </button>
            <Link className="btn btn-primary" to="/users">
              Ir a la lista
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && user && (
        <div className="form-card">
          <div className="edit-reference">
            <span className="id-badge">ID #{user.id}</span>
            <span className="muted-text">
              Registrado el{' '}
              {new Date(user.created_at).toLocaleString('es-PE', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </span>
          </div>

          {message && (
            <div className={`alert alert-${message.type}`} role="status" aria-live="polite">
              <span>{message.text}</span>
            </div>
          )}

          <UserForm
            key={user.id}
            initialValues={{ name: user.name, email: user.email }}
            onSubmit={handleUpdate}
            submitLabel="Guardar cambios"
            loading={saving}
          />
        </div>
      )}
    </section>
  );
}

export default EditUserPage;
