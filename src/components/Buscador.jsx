import { Fragment, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import useProyectos from '../hooks/useProyectos'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Buscador = () => {
  const [busqueda, setBusqueda] = useState('')
  const { buscador, handleBuscador, proyectos } = useProyectos()

  // iteraremos y filtraremos los proyectos para que salgan como una opcion de busqueda
  const proyectosFiltrados =
    busqueda === ''
      ? []
      : proyectos.filter((proyecto) =>
          proyecto.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )

  return (
    <Transition.Root
      show={buscador}
      as={Fragment}
      afterLeave={() => setBusqueda('')}
    >
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto mt-20 p-4 sm:p-20 md:p-20'
        onClose={handleBuscador}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity' />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <Combobox
            as='div'
            className='mx-auto max-w-xl transform divide-y text-white overflow-hidden rounded-xl border-2 bg-slate-700 shadow-2xl transition-all'
            onChange={(proyecto) =>
              (window.location = `/proyectos/${proyecto._id}`)
            }
          >
            <div className='relative'>
              <Combobox.Input
                className='h-12 w-full bg-transparent pl-5 pr-5 text-white placeholder-slate-100/80 sm:text-sm'
                placeholder='Buscar...'
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {proyectosFiltrados.length > 0 && (
              <Combobox.Options
                static
                className='capitalize max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-white'
              >
                {proyectosFiltrados.map((proyecto) => (
                  <Combobox.Option
                    key={proyecto._id}
                    value={proyecto}
                    className={({ active }) =>
                      classNames(
                        'cursor-default select-none px-4 py-2',
                        active && 'bg-sky-600 text-white'
                      )
                    }
                  >
                    {proyecto.nombre}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </Combobox>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}

export default Buscador
