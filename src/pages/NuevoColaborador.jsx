import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import FormularioColaborador from '../components/FormularioColaborador'
import { useEffect } from 'react'
import Spinner from '../components/Spinner'

const NuevoColaborador = () => {
  const { id } = useParams()
  const {
    obtenerProyecto,
    proyecto,
    cargando,
    colaborador,
    agregarColaborador,
  } = useProyectos()

  useEffect(() => {
    obtenerProyecto(id)
  }, [])

  return (
    <>
      <div>
        <h1 className='text-4xl font-black text-slate-800 mb-3'>
          Añadir nuevo colaborador(a)
        </h1>
        <p className='text-gray-700 font-medium text-xl'>
          Proyecto/{' '}
          <span className='text-gray-800 font-black'>{proyecto?.nombre}</span>
        </p>
      </div>
      <div className='mt-10 flex justify-center'>
        <FormularioColaborador />
      </div>

      <div className='mt-10 flex justify-center'>
        <div className='bg-white w-full lg:w-1/2 p-5 rounded-lg shadow'>
          <h2 className='text-gray-700 font-bold text-2xl mb-5 border-b'>
            Resultado
          </h2>

          {cargando ? (
            <Spinner />
          ) : (
            colaborador?._id && (
              <div className='flex justify-between items-center text-lg'>
                <p className='capitalize text-gray-500 font-medium'>
                  nombre:{' '}
                  <span className='font-bold text-gray-800'>
                    {colaborador.nombre}
                  </span>{' '}
                </p>
                <button
                  className='text-gray-100 bg-slate-800 hover:bg-slate-700 rounded-md p-1 font-bold capitalize duration-300 ease-in-out'
                  onClick={() =>
                    agregarColaborador({ email: colaborador.email })
                  }
                >
                  Añadir
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </>
  )
}

export default NuevoColaborador
