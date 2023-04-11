import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const Registrar = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  const navigate = useNavigate()

  const reiniciarAlerta = () => {
    setTimeout(() => {
      setAlerta({})
      navigate('/')
    }, 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if ([nombre, email, password, repetirPassword].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true,
      })
      reiniciarAlerta()
      return
    }

    if (password !== repetirPassword) {
      setAlerta({
        msg: 'Las contraseñas deben coincidir',
        error: true,
      })
      reiniciarAlerta()
      return
    }

    if (password.length <= 6) {
      setAlerta({
        msg: 'La contraseña es muy corta, min 6 caracteres',
        error: true,
      })
      reiniciarAlerta()
      return
    }

    // Creamos el usuario
    try {
      const { data } = await clienteAxios.post('/usuarios', {
        nombre,
        email,
        password,
      })
      // y mostramos la informacion que devuelve el servidor al crear la cuenta correctamente
      setAlerta({
        msg: data.msg,
        error: false,
      })

      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      })
    } finally {
      reiniciarAlerta()
    }
  }

  return (
    <>
      <h1 className='text-6xl text-sky-600 font-black capitalize mb-10'>
        Crea tu cuenta y administra tus{' '}
        <span className='text-slate-700'>Proyectos</span>{' '}
      </h1>

      {alerta.msg && <Alerta alerta={alerta} />}
      <form
        onSubmit={handleSubmit}
        className='my-10 md:my-0 bg-white shadow rounded-md px-10 py-5'
      >
        <div className='mb-2'>
          <label
            className='text-xl text-gray-600 font-bold uppercase block'
            htmlFor='nombre'
          >
            Nombre
          </label>
          <input
            className='bg-gray-50 border w-full rounded-md p-2 mt-2'
            type='text'
            name='nombre'
            id='nombre'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder='example: Lionel Messi...'
          />
        </div>

        <div className='mb-3'>
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

        <div className='md:flex md:gap-2 md:items-center md:justify-between'>
          <div className='mb-3 w-full'>
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

          <div className='mb-3 w-full'>
            <label
              className='text-xl text-gray-600 font-bold uppercase block'
              htmlFor='password2'
            >
              Repetir contraseña
            </label>
            <input
              className='bg-gray-50 border w-full rounded-md p-2 mt-2'
              type='password'
              name='password2'
              id='password2'
              value={repetirPassword}
              onChange={(e) => setRepetirPassword(e.target.value)}
              placeholder='Repite tu password...'
            />
          </div>
        </div>

        <button
          className='bg-sky-600 text-white w-full mt-5 py-2 text-lg font-bold uppercase rounded-md hover:bg-sky-800 duration-300 ease-in-out cursor-pointer'
          type='submit'
        >
          Crear cuenta
        </button>
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/'
          className=' rounded-md px-3 py-1 text-center my-4 text-slate-700 block font-bold text-sm hover:bg-gray-300'
        >
          ¿Tienes cuenta? Inicia sesión
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

export default Registrar
