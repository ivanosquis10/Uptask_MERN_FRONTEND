import { useContext } from 'react'
import ProyectosContext from '../context/ProyectosContext'

const useProyectos = () => useContext(ProyectosContext)

export default useProyectos
