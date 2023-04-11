import { useEffect, useState, createContext } from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  // estado que va a tener toda la informaicon del usuario al iniciar sesion
  const [auth, setAuth] = useState({})
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const getAuthData = (data) => {
    setAuth(data)
  }

  // revisar si hay un token (guardado en el localstorage) para hacer la validación y autenticacion del usuario
  useEffect(() => {
    const token = localStorage.getItem('token')

    const autenticarUsuario = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      try {
        const { data } = await clienteAxios('/usuarios/perfil', config)
        setAuth(data)
        // si el usuario ya esta autenticado, lo mandamos a la pagina de proyectos
        // navigate('/proyectos') // esto hace que el usuario siempre lo lleve al /proyectos, es opcional
      } catch (error) {
        // reiniciamos el estado auth para evitar problemas
        setAuth({})
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    autenticarUsuario()
  }, [])

  const handleLoading = () => {
    setLoading()
  }

  const cerrarSesionAuth = () => {
    setAuth({})
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        getAuthData,
        loading,
        cerrarSesionAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
export default AuthContext
