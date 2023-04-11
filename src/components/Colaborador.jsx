import useProyectos from '../hooks/useProyectos'

const Colaborador = ({ colaborador }) => {
  const { nombre, email } = colaborador

  const { handleModalEliminarColaborador } = useProyectos()

  return (
    <div className='border-b p-5 flex justify-between items-center'>
      <div className='flex flex-col  items-start'>
        <p className='capitalize mb-1 text-xl font-bold text-gray-950'>
          {nombre}
        </p>
        <p className='font-medium text-gray-700 text-sm'>{email}</p>
      </div>
      <div className='flex flex-col gap-1'>
        <button
          className='bg-red-700 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
          onClick={() => handleModalEliminarColaborador(colaborador)}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default Colaborador
