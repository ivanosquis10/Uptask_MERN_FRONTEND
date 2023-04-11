import React from 'react'

const Alerta = ({ alerta }) => {
  return (
    <div
      className={`${
        alerta.error ? 'from-red-400 to-red-600' : 'from-sky-400 to-sky-600'
      } bg-gradient-to-br uppercase text-white rounded-lg text-center font-bold text-sm my-5  p-4 tracking-wide`}
    >
      {alerta.msg}
    </div>
  )
}

export default Alerta
