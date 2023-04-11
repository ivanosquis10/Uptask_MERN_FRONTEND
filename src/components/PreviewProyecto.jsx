import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const PreviewProyecto = ({ proyecto }) => {
  const { auth } = useAuth()
  const { nombre, _id, cliente, creador } = proyecto

  return (
    <div className='bg-white py-2 px-6 shadow-xl border-b mb-1 rounded-md'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
        <div>
          <h2 className='capitalize text-2xl text-slate-800 font-bold'>
            {nombre}
          </h2>

          <p className='capitalize text-slate-500 font-medium'>
            para: <span className='font-bold text-slate-600'>{cliente}</span>
          </p>
        </div>
        <div className='flex gap-2 mt-2 md:mt-0'>
          {auth._id !== creador && (
            <p className='uppercase bg-green-600 font-bold py-1 px-2 rounded-lg text-white'>
              Colaborador
            </p>
          )}
          <Link
            to={`${_id}`}
            className='font-bold uppercase text-gray-900 
           py-1 px-2 rounded-md bg-gray-100 hover:bg-gray-300 duration-300 ease-in-out'
          >
            Ver proyecto
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PreviewProyecto
