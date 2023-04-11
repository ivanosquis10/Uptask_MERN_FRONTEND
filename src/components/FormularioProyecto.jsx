import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import Alerta from './Alerta'

const FormularioProyecto = () => {
  const [id, setId] = useState(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState('')
  const [cliente, setCliente] = useState('')

  const { alerta, mostrarAlerta, submitProyecto, proyecto } = useProyectos()
  const params = useParams()

  // forma para validar si estamos editando o creando un nuevo proyecto
  // para eso usaremos el parametro
  // si hay algo en la url /proyectos/editar/643208f88401ea8f80c6cb1f -> editando
  // proyectos/crear-proyecto -> nuevo proyecto
  useEffect(() => {
    if (params.id) {
      // luego seteamos los valores para se agreguen al formulario a editar
      setId(proyecto._id) // este id nos ayudara a validar si se esta editando o creando un nuevo proyecto
      setNombre(proyecto.nombre)
      setDescripcion(proyecto.descripcion)
      setFecha(proyecto.fechaEntrega?.split('T')[0])
      setCliente(proyecto.cliente)
    }
  }, [params])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if ([nombre, descripcion, fecha, cliente].includes('')) {
      mostrarAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true,
      })
      return
    }

    // pasar los datos hacia el provider
    await submitProyecto({ id, nombre, descripcion, fecha, cliente })

    setId(null)
    setNombre('')
    setDescripcion('')
    setFecha('')
    setCliente('')
  }

  const { msg } = alerta

  return (
    <form
      onSubmit={handleSubmit}
      className='px-5 py-10 bg-white w-full lg:w-1/2 rounded-lg shadow space-y-5'
    >
      {msg && <Alerta alerta={alerta} />}
      <div className=''>
        <label
          htmlFor='nombre'
          className='font-bold text-sm text-gray-700 uppercase'
        >
          nombre
        </label>
        <input
          id='nombre'
          type='text'
          placeholder='Nombre del proyecto'
          className='w-full p-2 mt-2 placeholder-gray-500 rounded-md border'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className=''>
        <label
          htmlFor='descripcion'
          className='font-bold text-sm text-gray-700 uppercase'
        >
          Descripcion
        </label>
        <input
          id='descripcion'
          type='text'
          placeholder='Descripcion del proyecto'
          className='w-full p-2 mt-2 placeholder-gray-500 rounded-md border'
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div className=''>
        <label
          htmlFor='fecha-entrega'
          className='font-bold text-sm text-gray-700 uppercase'
        >
          Fecha de Entrega
        </label>
        <input
          id='fecha-entrega'
          type='date'
          className='w-full p-2 mt-2 placeholder-gray-500 rounded-md border'
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <div className=''>
        <label
          htmlFor='cliente'
          className='font-bold text-sm text-gray-700 uppercase'
        >
          Nombre Cliente
        </label>
        <input
          id='cliente'
          type='text'
          placeholder='Coloca al cliente'
          className='w-full p-2 mt-2 placeholder-gray-500 rounded-md border'
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </div>

      <button className='w-full p-2 bg-sky-500 rounded-lg uppercase font-bold text-white'>
        {params.id ? 'Guardar cambios' : 'Agregar proyecto'}
      </button>
    </form>
  )
}

export default FormularioProyecto
