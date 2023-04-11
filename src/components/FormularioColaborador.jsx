import { useState, useRef } from 'react'
import Alerta from './Alerta'
import useProyectos from '../hooks/useProyectos'

const FormularioColaborador = () => {
  const emailRef = useRef(null)
  const { mostrarAlerta, alerta, submitColaborador } = useProyectos()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (emailRef.current.value === '') {
      mostrarAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true,
      })
      return
    }

    await submitColaborador(emailRef.current?.value)
  }
  return (
    <form
      onSubmit={handleSubmit}
      className='px-5 py-5 bg-white w-full lg:w-1/2 rounded-lg shadow space-y-5'
    >
      {alerta.msg && <Alerta alerta={alerta} />}
      <div className=''>
        <label
          htmlFor='email'
          className='font-bold text-sm text-gray-700 uppercase'
        >
          Email
        </label>
        <input
          id='email'
          type='email'
          placeholder='Email del colaborador'
          className='w-full p-2 mt-2 placeholder-gray-500 rounded-md border'
          ref={emailRef}
        />
      </div>

      <button className='w-full p-2 bg-sky-600 hover:bg-sky-700 duration-300 ease-in-out rounded-lg uppercase font-bold text-white'>
        {/* {params.id ? 'Guardar cambios' : 'Agregar proyecto'} */}
        Buscar colaborador
      </button>
    </form>
  )
}

export default FormularioColaborador
