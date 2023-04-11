import FormularioProyecto from '../components/FormularioProyecto'

const NuevoProyecto = () => {
  return (
    <>
      <h1 className='text-4xl font-black text-slate-800'>Crear Proyecto</h1>
      <div className='flex justify-center mt-10'>
        <FormularioProyecto />
      </div>
    </>
  )
}

export default NuevoProyecto
