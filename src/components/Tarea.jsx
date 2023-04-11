import useProyectos from '../hooks/useProyectos'
import useAdmin from '../hooks/useAdmin'
import { formatearFecha } from '../helpers/formatearFecha'

const Tarea = ({ tarea }) => {
  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } =
    useProyectos()
  const admin = useAdmin()

  const { nombre, descripcion, fechaEntrega, prioridad, estado, _id } = tarea
  return (
    <div className='border-b p-5 flex flex-col md:flex-row md:justify-between md:items-center'>
      <div className='flex flex-col items-start'>
        <p className='mb-1 text-xl font-bold uppercase text-gray-950'>
          {nombre}
        </p>
        <p className='mb-1 text-sm text-gray-800 uppercase font-medium'>
          {descripcion}
        </p>
        <p className='mb-1 text-sm font-medium text-gray-600'>
          Entrega:{' '}
          <span className='capitalize font-bold text-gray-700'>
            {formatearFecha(fechaEntrega)}
          </span>
        </p>
        <p className='mb-1 text-gray-600 font-medium'>
          Prioridad:{' '}
          <span className='font-bold text-gray-700'>{prioridad}</span>
        </p>
        {estado && (
          <p className='mb-1 text-slate-100 font-medium bg-green-600 rounded-md p-1'>
            Completada por:{' '}
            <span className='tracking-wide capitalize font-bold text-white'>
              {tarea.completado.nombre}
            </span>
          </p>
        )}
      </div>

      <div className='grid grid-cols-3 gap-1 md:flex md:flex-col md:gap-2 mt-3 '>
        <button
          onClick={() => completarTarea(_id)}
          className={` ${
            estado ? 'bg-green-700/80' : 'bg-slate-800/80'
          } px-4 py-2 text-white uppercase font-bold text-sm rounded-lg`}
        >
          {estado ? 'Completada' : 'Incompleta'}
        </button>

        {admin && (
          <button
            type='button'
            className='bg-indigo-500 px-4 py-2 text-white uppercase font-bold text-sm rounded-lg tracking-widest'
            onClick={() => handleModalEditarTarea(tarea)}
          >
            editar
          </button>
        )}

        {admin && (
          <button
            className='bg-red-700 px-4 py-2 text-white uppercase font-bold text-sm rounded-lg'
            onClick={() => handleModalEliminarTarea(tarea)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}

export default Tarea
