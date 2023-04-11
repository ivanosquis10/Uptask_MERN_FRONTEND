import { useEffect, useState, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import clienteAxios from '../config/clienteAxios'
import io from 'socket.io-client'

const ProyectosContext = createContext()
let socket

const ProyectosProvider = ({ children }) => {
  // tendran los proyectos del usuario
  const [proyectos, setProyectos] = useState([])
  const [alerta, setAlerta] = useState({})
  const [proyecto, setProyecto] = useState({})
  const [cargando, setCargando] = useState(false)
  const [modalFormTarea, setModalFormTarea] = useState(false)
  const [tarea, setTarea] = useState({})
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
  const [colaborador, setColaborador] = useState({})
  const [modalEliminarColaborador, setModalEliminarColaborador] =
    useState(false)
  const [buscador, setBuscador] = useState(false)

  const navigate = useNavigate()
  const { auth } = useAuth()

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta)

    setTimeout(() => {
      setAlerta({})
    }, 3000)
  }

  // funcion encargada de recibir los datos de los campos del formulario de crear proyecto
  // para hacer estas validacion nos basamos en el id que habria en la url
  // es decir, enviamos un id y si es NULL => creando nuevo proyecto
  // pero en caso de que haya un id en la url, quiere decir => editando el proyecto
  const submitProyecto = async (proyecto) => {
    if (proyecto.id) {
      await editarProyecto(proyecto)
    } else {
      await enviandoProyecto(proyecto)
    }
  }

  // function encargada de agregar un proyecto
  const enviandoProyecto = async (proyecto) => {
    try {
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await clienteAxios.post('/proyectos', proyecto, config)

      // esto es para sincronizar nuestra app con el backend, cuando se agregue un nuevo proyecto se actualizara en la vista del usuario
      setProyectos([...proyectos, data])

      setAlerta({
        msg: 'Proyecto creado correctamente!',
        error: false,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000)
    }
  }

  // function encargada de editar un proyecto
  const editarProyecto = async (proyecto) => {
    try {
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto.id}`,
        proyecto,
        config
      )

      // sincronizar los estados
      const proyectosActualizados = proyectos.map((proyectoState) =>
        proyectoState._id === data._id ? data : proyectoState
      )
      // asiganamos el nuevo estado con los proyectos actualizados al state de proyectos
      setProyectos(proyectosActualizados)

      // mostrar alerta
      setAlerta({
        msg: 'Proyecto actualizado correctamente!',
        error: false,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        // limpiamos la alerta
        setAlerta({})
        // redireccionar al usuario
        navigate('/proyectos')
      }, 3000)
    }
  }

  // funcion encargada de obtener los proyecto del usuario
  useEffect(() => {
    const obtenerProyectos = async () => {
      setCargando(true)
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await clienteAxios('/proyectos', config)
      setProyectos(data)
      setCargando(false)
    }

    obtenerProyectos()
  }, [auth])

  // SOCKET.IO - efecto que abrira la conexion con socket io
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL) // nos conectamos al backend
  }, [])

  // funcion encargada de obtener un proyecto en especifico
  const obtenerProyecto = async (id) => {
    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await clienteAxios(`/proyectos/${id}`, config)
      setProyecto(data)
    } catch (error) {
      navigate('/proyectos')
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      })
    } finally {
      setCargando(false)
      setTimeout(() => {
        setAlerta({})
      }, 3000)
    }
  }

  // function encargada de eliminar proyectos
  const eliminarProyecto = async (id) => {
    try {
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

      // sincronizar los estados
      const proyectosActualizados = proyectos.filter(
        (proyectoState) => proyectoState._id !== id
      )
      setProyectos(proyectosActualizados)

      // mostrar alerta
      setAlerta({
        msg: data.msg,
        error: false,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        // limpiamos la alerta
        setAlerta({})
        // redireccionar al usuario
        navigate('/proyectos')
      }, 3000)
    }
  }

  // funcion encargada de manejar el modal
  const handleModal = () => {
    setModalFormTarea(!modalFormTarea)
    // esto se hace para evitar que cuando se le haga click al crear nueva tarea quede con la informacion que esta cuando se le da click al editar una tarea
    setTarea({})
  }

  // function encargada de enviar los datos de la tarea dependiendo de -
  const submitTarea = async (tarea) => {
    if (tarea?.id) {
      // si viene el objeto con el id, indica que esta editando
      await editarTarea(tarea)
    } else {
      // caso contrario, seria una nueva tarea
      return enviarTarea(tarea)
    }
  }

  // funcion encargada de agregar la tarea
  const enviarTarea = async (tarea) => {
    try {
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso
      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await clienteAxios.post('/tareas', tarea, config)

      // agregar la tarea al state
      // creamos una copia del estate del proyecto
      // luego una copia de las tareas que hay dentro de ese proyecto y asignamos la nueva tarea
      // const proyectoActualizado = { ...proyecto }
      // proyectoActualizado.tareas = [...proyecto.tareas, data]
      // setProyecto(proyectoActualizado)

      setAlerta({
        msg: 'Tarea agregada correctamente!',
        error: false,
      })

      // SOCKET IO
      socket.emit('nueva tarea', data)
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setAlerta({})
        setModalFormTarea(false)
      }, 3000)
    }
  }

  // funcion encargada de editar la tarea
  const editarTarea = async (tarea) => {
    try {
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await clienteAxios.put(
        `/tareas/${tarea.id}`,
        tarea,
        config
      )

      // // sincronizar el estado
      // const proyectoActualizado = { ...proyecto } // realizamos una copia del proyecto
      // proyectoActualizado.tareas = proyectoActualizado.tareas.map(
      //   (tareaState) => (tareaState._id === data._id ? data : tareaState)
      // )
      // // asiganamos el nuevo estado con los proyectos actualizados al state de proyectos
      // setProyecto(proyectoActualizado)

      // mostrar la alerta

      setAlerta({
        msg: 'Tarea Actualizada correctamente!',
        error: false,
      })

      // socket io function
      socket.emit('actualizar tarea', data)
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setAlerta({})
        setModalFormTarea(false)
      }, 3000)
    }
  }

  const eliminarTarea = async () => {
    try {
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)

      // mostrar la alerta
      setAlerta({
        msg: data.msg,
        error: false,
      })

      // const proyectoActualizado = { ...proyecto } // realizamos una copia del proyecto
      // // actualizamos el estado
      // proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
      //   (tareaState) => tareaState._id !== tarea._id
      // )
      // setProyecto(proyectoActualizado)

      setModalEliminarTarea(false)

      // funcion del socketio
      socket.emit('eliminar tarea', tarea)

      setTarea({})
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setAlerta({})
      }, 3000)
    }
  }

  // funcion encargada de manejar el estado de la tarea
  const handleModalEditarTarea = (tarea) => {
    // console.log(tarea)
    setTarea(tarea)
    setModalFormTarea(true)
  }

  const handleModalEliminarTarea = (tarea) => {
    if (tarea._id) {
      setTarea(tarea)
    } else {
      setTarea({})
    }
    setModalEliminarTarea(!modalEliminarTarea)
  }

  const submitColaborador = async (email) => {
    setCargando(true)
    try {
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await clienteAxios.post(
        `/proyectos/colaboradores`,
        { email },
        config
      )
      setColaborador(data)
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      })
    } finally {
      setCargando(false)
      setTimeout(() => {
        setAlerta({})
      }, 3000)
    }
  }

  const agregarColaborador = async (email) => {
    try {
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await clienteAxios.post(
        `/proyectos/colaboradores/${proyecto._id}`,
        email,
        config
      )
      setAlerta({
        msg: data.msg,
        error: false,
      })
      setColaborador({})
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      })
      setColaborador({})
    } finally {
      setTimeout(() => {
        setAlerta({})
      }, 3000)
    }
  }

  const handleModalEliminarColaborador = (colaborador) => {
    if (colaborador._id) {
      setColaborador(colaborador)
    } else {
      setColaborador({})
    }
    setModalEliminarColaborador(!modalEliminarColaborador)
  }

  const eliminarColaborador = async () => {
    try {
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await clienteAxios.post(
        `/proyectos/eliminar-colaborador/${proyecto._id}`,
        { id: colaborador._id },
        config
      )

      const proyectoActualizado = { ...proyecto } // realizamos una copia del proyecto
      // actualizamos el estado
      proyectoActualizado.colaboradores =
        proyectoActualizado.colaboradores.filter(
          (colaboradoresState) => colaboradoresState._id !== colaborador._id
        )

      // mostrar la alerta
      setAlerta({
        msg: data.msg,
        error: false,
      })

      setProyecto(proyectoActualizado)
      setModalEliminarColaborador(false)
      setColaborador({})
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setAlerta({})
      }, 3000)
    }
  }

  const completarTarea = async (id) => {
    try {
      // primero extraemos el token de verificacion que esta en el LS
      const token = localStorage.getItem('token')
      if (!token) return // hacemos esta validacion por si acaso

      // configuracion para poder enviar el token al servidor (recuerda que recibe un bearer token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await clienteAxios.post(
        `/tareas/estado/${id}`,
        {},
        config
      )

      // // actualizamo el estado
      // const proyectoActualizado = { ...proyecto }
      // proyectoActualizado.tareas = proyectoActualizado.tareas.map(
      //   (tareasState) => (tareasState._id === data._id ? data : tareasState)
      // )
      // setProyecto(proyectoActualizado)

      // mostrar la alerta
      setAlerta({
        msg: data.msg,
        error: false,
      })
      setTarea({})

      // Socket IO
      socket.emit('cambiar estado', data)
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setAlerta({})
      }, 3000)
    }
  }

  const handleBuscador = () => {
    setBuscador(!buscador)
  }

  // FUNCIONES PARA EL SOCKET IO

  // agregar tarea en tiempo real
  const submitTareasProyectos = (tareaNueva) => {
    // agregar la tarea al state
    const proyectoActualizado = { ...proyecto }
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tareaNueva]
    setProyecto(proyectoActualizado)
  }

  // eliminar tarea en tiempo real
  const eliminarTareaProyecto = (tareaEliminada) => {
    const proyectoActualizado = { ...proyecto } // realizamos una copia del proyecto
    // actualizamos el estado
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
      (tareaState) => tareaState._id !== tareaEliminada._id
    )
    setProyecto(proyectoActualizado)
  }

  // actualizar los datos de una tarea en tiempo real
  const actualizarTareaProyecto = (tareaActualizada) => {
    // sincronizar el estado
    const proyectoActualizado = { ...proyecto } // realizamos una copia del proyecto
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tareaActualizada._id ? tareaActualizada : tareaState
    )
    // asiganamos el nuevo estado con los proyectos actualizados al state de proyectos
    setProyecto(proyectoActualizado)
  }

  // actualizar el estado de una tarea (completada o no) en tiempo real
  const cambiarEstadoTarea = (nuevoEstado) => {
    // actualizamo el estado
    const proyectoActualizado = { ...proyecto }
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareasState) =>
      tareasState._id === nuevoEstado._id ? nuevoEstado : tareasState
    )
    setProyecto(proyectoActualizado)
  }

  // function para cerrar sesion
  const cerrarSesionProyectos = () => {
    setProyectos([])
    setProyecto({})
    setAlerta({})
  }

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        alerta,
        mostrarAlerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormTarea,
        handleModal,
        submitTarea,
        tarea,
        handleModalEditarTarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        modalEliminarColaborador,
        handleModalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareasProyectos,
        eliminarTareaProyecto,
        actualizarTareaProyecto,
        cambiarEstadoTarea,
        cerrarSesionProyectos,
      }}
    >
      {children}
    </ProyectosContext.Provider>
  )
}

export { ProyectosProvider }
export default ProyectosContext
