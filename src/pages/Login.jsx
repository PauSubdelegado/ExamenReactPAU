import {useState} from 'react'
import {useNavigate} from 'react-router';
import { useAuth } from '../auth/AuthContext';
import {useFormik} from 'formik';
import * as Yup from 'yup';

const apiUrl = import.meta.env.VITE_API_URL;
// definr esquema YUP
const validationSchema = Yup.object({
  email: Yup.string().email('el email no es valido').required('el correo es obligatorio'),
  password: Yup.string().min(6,"la contraseña es demasiado corta!").required("la contraseña es obligtoria")
})


const Login = () => {

const {login, isAuthentificated } =useAuth();
const navigate = useNavigate();
const {error,setError}= useState('');

if (isAuthentificated) {
     navigate ('/home',{replace: true});
}

const formik = useFormik ({
  initialValues: {'email':'', 'password':''},
  validationSchema,
  onSubmit: (values) => {
    console.log(values)
    // fetch a login
    fetch(`${apiUrl}auth/login`,{
      method :"POST",
      headers : {'Content-Type':'application/json'},
      body: JSON.stringify(values)
      })
      .then(response => response.json())
      .then(data =>{
         console.log(data)
         if(data.success==false){
            setError(data.message)
         }else{
            login(data.token)
            //navigate('/home');
         }
      
        })
       .catch(errorApi =>{
        setError(errorApi)
  })


  }
})

  return (
    <>
    <h1>Inicio de sesión</h1>
      <form onSubmit={formik.handleSubmit} noValidate>
        <div>
          <label htmlFor='email'>Correu Electronic </label>
        </div>
        <div>
          <input 
            name='email' 
            type='email'
            value={formik.values.email}
            onChange ={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <span className='text-danger' >{formik.errors.email}</span>
        )} 

        <div>
          <label htmlFor='password'>Contraseña </label>
        </div>
        <div>
          <input 
            name='password' 
            type='password'
            value={formik.values.password}
            onChange ={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {formik.touched.password && formik.errors.password && (
          <span className='text-danger' >{formik.errors.password}</span>
        )} 
        <p className='text-danger'>{error}</p>
        <div>
          <button type='submit' className='btn btn-primary mt-2'>Enviar</button>
        </div>
        

      </form>
        
    </>
  )
}

export default Login