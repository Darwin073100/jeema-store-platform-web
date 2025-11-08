import React from 'react'

interface Props{
  theadList: string[],
  isActions?: boolean,
  children?: any,
}

const PrimaryTable = ({ isActions = true, theadList, children }: Props) => {
  return (
    // **1. Añadir rounded-xl y overflow-hidden a la tabla**
    <table className="w-full text-sm text-left text-gray-700 rounded-xl overflow-hidden shadow-lg">
      <thead className='bg-white text-xs text-gray-700 uppercase font-bold'>
        <tr>
          {theadList.map((item, index) =>
            // 2. Aplicar redondeo a la primera y última celda de la cabecera
            <td
              key={item}
              scope="col"
              className={`border-b border-b-gray-200 px-6 py-6 ${
                index === 0 ? 'rounded-tl-xl' : '' // Redondear esquina superior izquierda
              } ${
                !isActions && index === theadList.length - 1 ? 'rounded-tr-xl' : '' // Redondear superior derecha si NO hay columna de Acciones
              }`}
            >
              {item.toString()}
            </td>
          )}
          { isActions &&
            <td
              scope="col"
              className="border-b border-b-gray-200 text-right px-6 py-4 rounded-tr-xl" // Redondear esquina superior derecha
            >
              Acciones
            </td>
          }
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}

export { PrimaryTable }