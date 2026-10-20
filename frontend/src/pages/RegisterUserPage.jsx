import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { createUser } from '../services/userService';

function RegisterUserPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleRegister(values) {
    setLoading(true);
    setMessage(null);

    try {
      const result = await createUser(values);
      setMessage({ type: 'success', text: result.message });
      return true;
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      return false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Nuevo registro</span>
          <h1>Registrar usuario</h1>
          <p>Completa el nombre y el correo electrónico para crear la cuenta.</p>
        </div>
        <Link className="btn btn-secondary" to="/users">
          Volver a la lista
        </Link>
      </header>

      <div className="form-card">
        {message && (
          <div className={`alert alert-${message.type}`} role="status" aria-live="polite">
            <span>{message.text}</span>
            {message.type === 'success' && (
              <Link className="alert-link" to="/users">
                Ver en la lista
              </Link>
            )}
          </div>
        )}

        <UserForm
          onSubmit={handleRegister}
          submitLabel="Registrar usuario"
          loading={loading}
          resetOnSuccess
        />

        <p className="form-hint">
          El correo electrónico debe ser único. Si ya está registrado, el servidor
          mostrará un mensaje de aviso.
        </p>
      </div>
    </section>
  );
}

export default RegisterUserPage;
