import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import useAuth from '../hooks/useAuth'
import Alerta from '../components/Alerta'
import Spinner from '../components/Spinner'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})
  const navigate = useNavigate()

  const { getAuthData, auth, loading } = useAuth()

  // todo: pendiente de cambio
  useEffect(() => {
    if (auth?._id) {
      navigate('/proyectos')
    }
  }, [auth])

  const reiniciarAlerta = () => {
    setTimeout(() => {
      setAlerta({})
    }, 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // validamos que los campos esten llenos
    if ([email, password].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true,
      })
    }

    try {
      const { data } = await clienteAxios.post('/usuarios/login', {
        email,
        password,
      })
      localStorage.setItem('token', data.token)
      getAuthData(data)
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      })
    } finally {
      navigate('/proyectos')
      reiniciarAlerta()
    }
  }

  if (loading) return <Spinner />

  return (
    <>
      <h1 className='text-6xl text-sky-600 font-black capitalize'>
        Inicia sesión y administra tus{' '}
        <span className='text-slate-700'>Proyectos</span>{' '}
      </h1>

      {alerta.msg && <Alerta alerta={alerta} />}

      <form
        onSubmit={handleSubmit}
        className='my-10 md:my-0 bg-white shadow rounded-md px-10 py-5'
      >
        <div className='mb-5'>
          <label
            className='text-xl text-gray-600 font-bold uppercase block'
            htmlFor='email'
          >
            Email
          </label>
          <input
            className='bg-gray-50 border w-full rounded-md p-2 mt-2'
            type='email'
            name='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='example: your@email.com'
          />
        </div>

        <div className=''>
          <label
            className='text-xl text-gray-600 font-bold uppercase block'
            htmlFor='password'
          >
            Contraseña
          </label>
          <input
            className='bg-gray-50 border w-full rounded-md p-2 mt-2'
            type='password'
            name='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Example: 123455, im batman...'
          />
        </div>
        <button
          className='bg-sky-600 text-white w-full mt-5 py-2 text-lg font-bold uppercase rounded-md hover:bg-sky-800 duration-300 ease-in-out cursor-pointer'
          type='submit'
        >
          Iniciar sesion
        </button>
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/registrar'
          className=' rounded-md px-3 py-1 text-center my-4 text-slate-700 block font-bold text-sm hover:bg-gray-300'
        >
          ¿No tienes cuenta? Regístrate
        </Link>
        <Link
          to='/olvide-password'
          className=' rounded-md px-3 py-1 text-center my-4 text-slate-700 block font-bold text-sm hover:bg-gray-300'
        >
          Olvidé mi contraseña
        </Link>
      </nav>
    </>
  )
}

export default Login
