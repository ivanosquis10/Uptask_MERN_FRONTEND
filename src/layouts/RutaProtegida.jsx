import { Outlet, Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Spinner from '../components/Spinner'

const RutaProtegida = () => {
  const { auth, loading } = useAuth()

  if (loading) return <Spinner />

  return (
    <>
      {auth._id ? (
        <div className='bg-gray-100'>
          <Header />
          <div className='md:flex md:min-h-screen'>
            <Sidebar />
            <main className=' flex-1 px-10 py-5'>
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <Navigate to='/' />
      )}
    </>
  )
}

export default RutaProtegida
