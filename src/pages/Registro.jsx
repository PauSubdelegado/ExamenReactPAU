import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import axios from 'axios';

const urlApi = import.meta.env.VITE_API_URL;

const validationSchema = Yup.object({
  name: Yup.string().min(3, "El nombre de usuario mínimo debe tener 3 carácteres").max(25, "El nombre de usuario debe tener como máximo 25 carácteres").required('El nombre de usuario es obligatorio'),
  email: Yup.string().email('El correo no es valido').required('El correo es obligatorio'),
  password: Yup.string().min(6, "¡La contraseña es demasiado corta!").required("La contraseña es obligatoria")
});

const Registro = () => {

  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/home', { replace: true });
  }

  const formik = useFormik({
    initialValues: {
      'name': '',
      'email': '',
      'password': ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // fetch a login
      fetch(`${urlApi}auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.success == false) {
            setError(data.message)
          } else {
            navigate('/login');
            //navigate
          }
        }
        )
        .catch(error =>
          setError(error)
        )
      /*
        .catch(errorApi =>{
        setError(errorApi)
      */
    }
  });

  return (
    <>
      <h1>Registrarse</h1>
      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="">
          <label htmlFor="text">Nombre de usuario</label>
        </div>
        <div className="">
          <input
            type="text"
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="">
          {formik.touched.name && formik.errors.name && (
            <span className="text-danger">{formik.errors.name}</span>
          )}
        </div>
        <div className="">
          <label htmlFor="email">Correo Electrónico</label>
        </div>
        <div className="">
          <input
            type="email"
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="">
          {formik.touched.email && formik.errors.email && (
            <span className="text-danger">{formik.errors.email}</span>
          )}
        </div>
        <div className="">
          <label htmlFor="password">Contraseña</label>
        </div>
        <div className="">
          <input
            type="password"
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="">
          {formik.touched.password && formik.errors.password && (
            <span className="text-danger">{formik.errors.password}</span>
          )}
        </div>
        <p className='m-0 py-2 text-danger'>{error}</p>
        <div className="">
          <button type="submit" className='btn btn-dark'>Enviar</button>
        </div>
      </form>
    </>
  )
}

export default Registro