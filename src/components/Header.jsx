import useProyectos from '../hooks/useProyectos'
import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import Buscador from './Buscador'

const Header = () => {
  const { handleBuscador, cerrarSesionProyectos } = useProyectos()
  const { cerrarSesionAuth } = useAuth()

  const handleCerrarSesion = () => {
    cerrarSesionProyectos()
    cerrarSesionAuth()
    // y eliminamos el token del localstorage
    localStorage.removeItem('token')
  }

  return (
    <header className='px-4 py-5 bg-slate-800'>
      <div className='md:flex md:justify-between md:items-center'>
        <h2 className='text-center text-4xl text-sky-500 font-black uppercase mb-5 md:mb-0'>
          Uptask
        </h2>

        <div className='flex flex-col md:flex-row gap-2 text-center'>
          <button
            className='font-bold uppercase text-sky-500  hover:bg-slate-700 py-1 px-2 rounded-md duration-300 ease-in-out'
            type='button'
            onClick={handleBuscador}
          >
            Buscar proyecto
          </button>
          <Link
            to='/proyectos'
            className='font-bold uppercase text-sky-500  hover:bg-slate-700 py-1 px-2 rounded-md duration-300 ease-in-out'
          >
            Proyectos
          </Link>
          <button
            type='button'
            className='font-bold uppercase text-sky-500 bg-slate-700 hover:bg-slate-900 py-1 px-2 rounded-md duration-300 ease-in-out'
            onClick={handleCerrarSesion}
          >
            Cerrar sesión
          </button>
          <Buscador />
        </div>
      </div>
    </header>
  )
}

export default Header
