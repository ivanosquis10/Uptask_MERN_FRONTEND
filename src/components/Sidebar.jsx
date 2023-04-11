import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Sidebar = () => {
  const { auth } = useAuth()
  return (
    <aside className='md:w-1/4 lg:w-1/5 xl:w-1/6 text-white bg-slate-700 p-5'>
      <p className='text-2xl font-medium'>
        Hola:{' '}
        <span className='capitalize font-bold text-sky-500'>{auth.nombre}</span>
      </p>

      <Link
        to='crear-proyecto'
        className='block bg-slate-800 hover:bg-slate-800/80 font-bold rounded-lg p-2 mt-5 text-center uppercase duration-300 ease-in-out'
      >
        crear proyecto
      </Link>
    </aside>
  )
}

export default Sidebar
