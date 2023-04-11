import useProyectos from './useProyectos'
import useAuth from './useAuth'

// hook que se va a encargar de mostrar ciertas parte de la aplicacion si el usuario actual es el creador o un colaborador
// si es admin, se muestra todo,
// caso contrario mostrará ciertas acciones
const useAdmin = () => {
  const { proyecto } = useProyectos()
  const { auth } = useAuth()
  // quiere decir que es el admin
  return proyecto.creador === auth._id
}

export default useAdmin
