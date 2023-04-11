import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import FormularioProyecto from '../components/FormularioProyecto'
import Spinner from '../components/Spinner'

const EditarProyecto = () => {
  const { obtenerProyecto, proyecto, cargando, eliminarProyecto } =
    useProyectos()
  const { id } = useParams()

  useEffect(() => {
    obtenerProyecto(id)
  }, [])

  const handleClick = () => {
    if (confirm('¿Deseas eliminar este proyecto?')) {
      eliminarProyecto(id)
    }
  }

  const { nombre } = proyecto

  if (cargando) return <Spinner />
  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-black text-slate-800 mb-5'>
          Editar Proyecto: {nombre}
        </h1>
        <div className='flex items-center text-gray-500 rounded-md gap-1 py-1 px-2 hover:text-gray-800 hover:bg-gray-300 border-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
            />
          </svg>

          <button onClick={handleClick} className='uppercase font-bold'>
            Eliminar
          </button>
        </div>
      </div>

      <div className='flex justify-center mt-10'>
        <FormularioProyecto />
      </div>
    </>
  )
}

export default EditarProyecto
