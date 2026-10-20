import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formulario controlado y reutilizable para registrar o editar usuarios.
 * - `initialValues`: valores iniciales de nombre y correo.
 * - `onSubmit`: función async que recibe { name, email } y devuelve true si guardó.
 * - `resetOnSuccess`: limpia los campos cuando el registro fue exitoso.
 */
function UserForm({
  initialValues = { name: '', email: '' },
  onSubmit,
  submitLabel = 'Guardar usuario',
  loading = false,
  resetOnSuccess = false
}) {
  const [values, setValues] = useState({
    name: initialValues.name || '',
    email: initialValues.email || ''
  });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previous) => ({ ...previous, [name]: value }));

    // Limpia el error del campo mientras el usuario vuelve a escribir.
    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};

    if (!values.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
    } else if (values.name.trim().length > 100) {
      newErrors.name = 'El nombre no debe superar los 100 caracteres.';
    }

    if (!values.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (values.email.trim().length > 150) {
      newErrors.email = 'El correo no debe superar los 150 caracteres.';
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      newErrors.email = 'Ingresa un correo válido, por ejemplo nombre@dominio.com.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    // Evita que el navegador recargue la página.
    event.preventDefault();

    if (loading || !validate()) {
      return;
    }

    const success = await onSubmit({
      name: values.name.trim(),
      email: values.email.trim()
    });

    if (success && resetOnSuccess) {
      setValues({ name: '', email: '' });
      setErrors({});
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="name">Nombre completo</label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          placeholder="Ej. María Fernanda López"
          maxLength={100}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          disabled={loading}
        />
        {errors.name && (
          <p className="field-error" id="name-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Ej. maria@example.com"
          maxLength={150}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={loading}
        />
        {errors.email && (
          <p className="field-error" id="email-error">
            {errors.email}
          </p>
        )}
      </div>

      <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
        {loading ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
}

export default UserForm;
