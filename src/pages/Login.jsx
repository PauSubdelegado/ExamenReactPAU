import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const apiUrl = import.meta.env.VITE_API_URL;

const validationSchema = Yup.object({
  email: Yup.string().email('El correu no es valido').required('El correo es obligatorio'),
  password: Yup.string().min(6, 'La contrasenya es demasiado corta').required('La contraseña es obligatoria'),
});

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, []);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: (values) => {
      fetch(`${apiUrl}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success == false) {
            setError(data.message);
          } else {
            login(data.token);
            navigate('/home', { replace: true });
          }
        })
        .catch((e) => setError(e.message));
    },
  });

  return (
    <>
      <div className="position-relative p-2" style={{ zIndex: 1 }}>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-6 col-lg-4 p-4">

            <form onSubmit={formik.handleSubmit} noValidate>

              {/* Email */}
              <div className="login-field mb-3">
                <label className="login-label form-label" htmlFor="email">
                  Correu electrònic
                </label>
                <div className="login-input-wrap">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                    placeholder="nom@empresa.com"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="login-field mb-4">
                <div className="login-label-row">
                  <label className="login-label form-label" htmlFor="password">
                    Contrasenya
                  </label>
                </div>
                <div className="login-input-wrap">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">{formik.errors.password}</div>
                  )}
                </div>
              </div>

              {error && <p className="text-danger mb-3">{error}</p>}

              <button
                type="submit"
                className="tablon-btn-add d-flex align-items-center gap-2 border-0 rounded-2 px-3 py-2 fw-500"
                style={{ background: "#F5E6C8", color: "#3B1F07", fontSize: 13, cursor: "pointer" }}
              >
                Iniciar sesión
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}