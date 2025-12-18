'use client'
import React from 'react'
interface Props{
  theadList: string[],
  isActions?: boolean,
  children?: any,
}
const BasicTable = ({ isActions = true, theadList, children }: Props) => {
  return (
    <table className="w-full text-sm text-left text-gray-700">
      <thead className='text-xs text-gray-700 uppercase bg-gray-50/70 font-bold border-b border-gray-300'>
        <tr>
          {theadList.map( item =>  <td key={item} scope="col" className="px-6 py-3">{item.toString()}</td>)}
          { isActions && <td key="actions" scope="col" className="px-6 py-3 text-right">Acciones</td>}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}

export { BasicTable }
