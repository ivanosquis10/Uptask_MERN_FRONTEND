import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <>
      <main className='w-full h-screen grid place-content-center'>
        <div className='w-11/12 md:w-10/12 lg:w-6/12 mx-auto space-y-5'>
          <Outlet />
        </div>
      </main>
    </>
  )
}

// container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center

export default AuthLayout
