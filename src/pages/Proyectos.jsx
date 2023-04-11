import useProyectos from '../hooks/useProyectos'
import PreviewProyecto from '../components/PreviewProyecto'
import Alerta from '../components/Alerta'
import Spinner from '../components/Spinner'

const Proyectos = () => {
  const { proyectos, alerta, cargando } = useProyectos()

  // EJEMPLO:  este efecto va a hacer la conexion con socket io al cargar el componente
  // useEffect(() => {
  //   socket = io(import.meta.env.VITE_BACKEND_URL)
  //   socket.emit('prueba') // emit es para crear un evento, mientras que en el backend hay que registrarlo con el "on" (deben tener el mismo nombre)
  //   socket.on('respuesta', (nombre) => {
  //     console.log('desde el frontend', nombre)
  //   })
  // }, [])

  if (cargando) return <Spinner />
  return (
    <>
      <h1 className='text-4xl font-black text-slate-800 mb-5'>Proyectos</h1>

      {alerta.msg && <Alerta alerta={alerta} />}

      {proyectos.length ? (
        proyectos.map((proyecto) => (
          <PreviewProyecto key={proyecto._id} proyecto={proyecto} />
        ))
      ) : (
        <p className='bg-white rounded-lg text-slate-800 uppercase text-xl font-bold text-center p-2 shadow'>
          No tienes proyectos
        </p>
      )}
    </>
  )
}

export default Proyectos
