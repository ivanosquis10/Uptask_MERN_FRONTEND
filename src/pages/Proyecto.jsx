import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import useAdmin from '../hooks/useAdmin'
import ModalFormularioTarea from '../components/ModalFormTarea'
import Tarea from '../components/Tarea'
import ModalEliminarTarea from '../components/ModalEliminarTarea'
import ModalEliminarColaborador from '../components/ModalEliminarColaborador'
import Colaborador from '../components/Colaborador'
import Alerta from '../components/Alerta'
import io from 'socket.io-client'
import Spinner from '../components/Spinner'

let socket

const Proyecto = () => {
  const {
    obtenerProyecto,
    proyecto,
    cargando,
    handleModal,
    alerta,
    submitTareasProyectos,
    eliminarTareaProyecto,
    actualizarTareaProyecto,
    cambiarEstadoTarea,
  } = useProyectos()
  const { id } = useParams()
  const admin = useAdmin()

  useEffect(() => {
    obtenerProyecto(id)
  }, [])

  // efecto para conectarnos a socket io // este sera el efecto que se ejecute al INICIAR
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL) // nos conectamos al backend
    socket.emit('abrir proyecto', id) // y le digo en que proyecto estoy y lo asigno a un "room"
  }, [])

  // encargada de leer el evento de "tarea agregada"
  useEffect(() => {
    socket.on('tarea agregada', (tareaNueva) => {
      // validamos, para identificar a que proyecto se le va a agregar
      if (tareaNueva.proyecto === proyecto._id) {
        submitTareasProyectos(tareaNueva)
      }
    })

    socket.on('tarea eliminada', (tareaEliminada) => {
      if (tareaEliminada.proyecto === proyecto._id) {
        eliminarTareaProyecto(tareaEliminada)
      }
    })

    socket.on('tarea actualizada', (tareaActualizada) => {
      if (tareaActualizada.proyecto._id === proyecto._id) {
        actualizarTareaProyecto(tareaActualizada)
      }
    })

    socket.on('nuevo estado', (nuevoEstado) => {
      if (nuevoEstado.proyecto._id === proyecto._id) {
        cambiarEstadoTarea(nuevoEstado)
      }
    })
  })

  const { nombre } = proyecto
  if (cargando) return <Spinner />

  return (
    <>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <h1 className='text-4xl font-black text-slate-800 mb-2'>
          Proyecto {nombre}
        </h1>

        {admin && (
          <div className='w-full md:w-auto tracking-widest uppercase text-sm text-white bg-slate-800 hover:bg-slate-800/80 font-bold rounded-lg p-2 text-center duration-300 ease-in-out flex items-center gap-1 mt-5 md:mt-2'>
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

            <Link
              className='uppercase font-bold'
              to={`/proyectos/editar/${id}`}
            >
              Editar proyecto
            </Link>
          </div>
        )}
      </div>
      {admin && (
        <button
          onClick={handleModal}
          className='w-full md:w-auto tracking-wider uppercase text-sm text-white bg-slate-800 hover:bg-slate-800/80 font-bold rounded-lg p-2 text-center duration-300 ease-in-out flex items-center gap-1 mt-2'
        >
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
              d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          crear tarea
        </button>
      )}

      <h4 className='font-bold text-slate-800 text-xl uppercase mt-10'>
        Tareas del proyecto
      </h4>

      <div className='bg-white mt-5 shadow rounded-lg'>
        {proyecto.tareas?.length ? (
          proyecto.tareas?.map((tarea) => (
            <Tarea key={tarea._id} tarea={tarea} />
          ))
        ) : (
          <p className='font-bold text-center p-5 text-lg uppercase'>
            No hay tareas en este proyecto
          </p>
        )}
      </div>

      {admin && (
        <>
          <div className='flex items-center justify-between mt-10'>
            <h4 className='font-bold text-xl uppercase'>Colaboradores</h4>
            <Link
              to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
              className='flex items-center gap-1 text-gray-500 border-2 rounded-md p-1 hover:text-gray-800 hover:bg-gray-300 font-bold uppercase'
            >
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
                  d='M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z'
                />
              </svg>
              Añadir
            </Link>
          </div>
          <div className='bg-white mt-10 shadow rounded-lg mb-10'>
            {proyecto.colaboradores?.length ? (
              proyecto.colaboradores?.map((colaborador) => (
                <Colaborador key={colaborador._id} colaborador={colaborador} />
              ))
            ) : (
              <p className='font-bold text-center p-5 text-lg uppercase'>
                No hay colaboradores en este proyecto
              </p>
            )}
          </div>
        </>
      )}

      {/* modal que se muestra para agregar tarea */}
      <ModalFormularioTarea />
      {/* modal que se muestra para eliminar tarea */}
      <ModalEliminarTarea />
      {/* modal que se muestra para eliminar un colaborador */}
      <ModalEliminarColaborador />
    </>
  )
}

export default Proyecto

/*

 <div className='w-fit mt-2 flex items-center text-gray-500 border-2 rounded-md p-1 hover:text-gray-800 hover:bg-gray-300 gap-1'>
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

            <Link
              className='uppercase font-bold'
              to={`/proyectos/editar/${id}`}
            >
              Editar proyecto
            </Link>
          </div>

          */
