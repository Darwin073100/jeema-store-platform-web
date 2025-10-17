import React from 'react'
import { SaleEntity } from '../../domain/entities/sale-entity'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter'
interface Props {
    data: SaleEntity
}
const SaleDetailList = ({ data }: Props) => {

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
                <thead className="text-xs text-gray-600 uppercase bg-blue-50/50 font-semibold sticky top-0"> {/* Fondo ligeramente azul para la cabecera */}
                    <tr>
                        <th scope="col" className="px-4 py-3">Producto</th>
                        <th scope="col" className="px-4 py-3 text-right">Cant.</th>
                        <th scope="col" className="px-4 py-3 text-right text-orange-600">P. Unitario</th>
                        <th scope="col" className="px-4 py-3 text-right">Descuento</th>
                        <th scope="col" className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {data.saleDetails?.map(item => (
                        <tr
                            key={item.saleDetailId}
                            className="bg-white border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-150" // Efecto hover sutil
                        >
                            <td className="px-4 py-3">
                                <p className="font-semibold text-gray-800">{item.productNameAtSale}</p>
                                <p className="text-xs text-gray-500">Marca: {item.productBrandAtSale} | Código: {item.productBarCodeAtSale}</p>
                            </td>
                            <td className="px-4 py-3 text-right font-medium">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-semibold text-orange-600">
                                {numberMoneyFormat(item.unitPriceAtSale)}
                            </td>
                            <td className="px-4 py-3 text-right text-red-600">
                                -{numberMoneyFormat(item.discountItem)}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                                {numberMoneyFormat(item.subtotalItem)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export { SaleDetailList }
