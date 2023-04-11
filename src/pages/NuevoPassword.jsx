import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const NuevoPassword = () => {
  const [password, setPassword] = useState('')
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState({})
  const [passwordModificado, setPasswordModificado] = useState(false)

  const { token } = useParams()

  // comprobar si el token es valido
  useEffect(() => {
    const comprobarToken = async () => {
      try {
        const url = `/usuarios/reset-password/${token}`

        // si es valido, seteamos el estado a true
        await clienteAxios.get(url)
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        })
      }
    }
    return () => comprobarToken()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // validamos la extension de la password
    if (password.length < 6) {
      setAlerta({
        msg: 'El Password debe ser minimo 6 caracteres',
        error: true,
      })
      return
    }

    try {
      const url = `/usuarios/reset-password/${token}`
      const { data } = await clienteAxios.post(url, { password })

      setAlerta({
        msg: data.msg,
        error: false,
      })
      setPassword('')
      setPasswordModificado(true)
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      })
    }
  }

  return (
    <>
      <h1 className='text-6xl text-sky-600 font-black capitalize'>
        Reestablece tu contraseña y administra tus{' '}
        <span className='text-slate-700'>Proyectos</span>{' '}
      </h1>

      {alerta.msg && <Alerta alerta={alerta} />}

      {tokenValido && (
        <form
          onSubmit={handleSubmit}
          className='my-10 md:my-0 bg-white shadow rounded-md px-10 py-5'
        >
          <div className='mb-5'>
            <label
              className='text-xl text-gray-600 font-bold uppercase block'
              htmlFor='password'
            >
              Nueva contraseña
            </label>
            <input
              className='bg-gray-50 border w-full rounded-md p-2 mt-2'
              type='password'
              name='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Nueva contraseña...'
            />
          </div>
          <button
            className='bg-sky-600 text-white w-full mt-5 py-2 text-lg font-bold uppercase rounded-md hover:bg-sky-800 duration-300 ease-in-out cursor-pointer'
            type='submit'
          >
            Cambiar contraseña
          </button>
        </form>
      )}

      {passwordModificado && (
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/'
        >
          Inicia Sesión
        </Link>
      )}
    </>
  )
}

export default NuevoPassword
