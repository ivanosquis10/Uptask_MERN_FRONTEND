import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'

import Alerta from '../components/Alerta'

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({})
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

  const params = useParams()
  const { id } = params

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteAxios(url)

        setAlerta({
          msg: data.msg,
          error: false,
        })

        setCuentaConfirmada(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        })
      }
    }
    return () => confirmarCuenta()
  }, [])

  const { msg } = alerta

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>
        Confirma tu cuenta y Comienza a crear tus {''}
        <span className='text-slate-700'>proyectos</span>
      </h1>

      <div className='mt-20 md:mt-10 bg-gray-200 p-5 rounded-xl'>
        <p className='text-gray-600 text-xl text-center font-bold'>
          Hola, tu estado acutal es
        </p>
        {msg && <Alerta alerta={alerta} />}

        {cuentaConfirmada && (
          <Link
            className='block text-center my-5 text-slate-500 uppercase text-sm'
            to='/'
          >
            Inicia Sesión
          </Link>
        )}
      </div>
    </>
  )
}

export default ConfirmarCuenta
