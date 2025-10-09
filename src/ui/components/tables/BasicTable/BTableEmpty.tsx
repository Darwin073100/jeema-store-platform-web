import React from 'react'
interface Props {
    colsNumber: number;
}
const BTableEmpty = ({ colsNumber }: Props) => {
    return (
        <tr className="bg-white border-b border-gray-100 hover:bg-gray-50 transition duration-150">
            <td className='px-6 py-4 font-medium' colSpan={colsNumber}>No hay registros...</td>
        </tr>
    )
}

export { BTableEmpty }
