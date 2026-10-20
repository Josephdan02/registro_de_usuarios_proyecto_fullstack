import { Link } from 'react-router-dom';

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function UserList({ users, onDelete, deletingId }) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">
          👤
        </span>
        <h3>Todavía no hay usuarios registrados</h3>
        <p>Registra el primer usuario para verlo en esta tabla.</p>
        <Link className="btn btn-primary" to="/register">
          Registrar un usuario
        </Link>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Correo</th>
            <th scope="col">Fecha de creación</th>
            <th scope="col" className="actions-column">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <span className="id-badge">#{user.id}</span>
              </td>
              <td>{user.name}</td>
              <td>
                <a href={`mailto:${user.email}`} className="email-link">
                  {user.email}
                </a>
              </td>
              <td>{formatDate(user.created_at)}</td>
              <td>
                <div className="row-actions">
                  <Link
                    className="btn btn-secondary btn-sm"
                    to={`/users/${user.id}/edit`}
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    type="button"
                    onClick={() => onDelete(user)}
                    disabled={deletingId === user.id}
                  >
                    {deletingId === user.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
