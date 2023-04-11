import axios from 'axios'

// crearemos un cliente para que las url sean mas cortas, mas mantenible y legible
const clienteAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
})

export default clienteAxios
