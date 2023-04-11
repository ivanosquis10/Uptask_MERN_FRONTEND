import { useState } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const OlvidePassword = () => {
  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState({})

  const reiniciarAlerta = () => {
    setTimeout(() => {
      setAlerta({})
    }, 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email === '' || email.length < 6) {
      setAlerta({
        msg: 'El campo es obligatorio',
        error: true,
      })
      reiniciarAlerta()
      return
    }

    try {
      const { data } = await clienteAxios.post('/usuarios/reset-password', {
        email,
      })
      setAlerta({
        msg: data.msg,
        error: false,
      })

      setEmail('')
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
        Recupera tu contraseña y administra tus{' '}
        <span className='text-slate-700'>Proyectos</span>{' '}
      </h1>

      {alerta.msg && <Alerta alerta={alerta} />}

      <form
        onSubmit={handleSubmit}
        className='my-10 md:mt-20 bg-white shadow rounded-md px-10 py-5'
      >
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
            placeholder='please your email...'
          />
        </div>

        <button
          className='bg-sky-600 text-white w-full mt-5 py-2 text-lg font-bold uppercase rounded-md hover:bg-sky-800 duration-300 ease-in-out cursor-pointer'
          type='submit'
        >
          Enviar instrucciones
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
          to='/registrar'
          className=' rounded-md px-3 py-1 text-center my-4 text-slate-700 block font-bold text-sm hover:bg-gray-300'
        >
          ¿No tienes cuenta? Regístrate
        </Link>
      </nav>
    </>
  )
}

export default OlvidePassword
