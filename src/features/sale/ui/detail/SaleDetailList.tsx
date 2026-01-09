'use client'
import React from 'react'
import { SaleEntity } from '../../domain/entities/sale-entity'
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter'
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton'
import { IoReturnDownForward } from 'react-icons/io5'
import { ReturnsPoductsModal } from './ReturnsProductsModal'
import { useReturnsProducts } from '../../hooks/details/useReturnsProducts'
import { SaleStatusEnum } from '../../domain/enums/sale-status.enum'
interface Props {
    data: SaleEntity
}
const SaleDetailList = ({ data }: Props) => {
    const { handleSelectDetailToReturn } = useReturnsProducts();
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
                <thead className='text-xs text-gray-600 uppercase bg-blue-50/50 font-semibold sticky top-0'>
                    <tr>
                        <th scope="col" className="px-2 py-3">Producto</th>
                        <th scope="col" className="px-2 py-3 text-center">Cant.</th>
                        <th scope="col" className="px-2 py-3 text-center">P. Regular</th>
                        <th scope="col" className="px-2 py-3 text-center">Sub. Total</th>
                        <th scope="col" className="px-2 py-3 text-center text-orange-600">P. Unitario</th>
                        <th scope="col" className="px-2 py-3 text-center">Descuento</th>
                        <th scope="col" className="px-2 py-3 text-center">Total</th>
                        <th scope="col" className="px-2 py-3 text-center">Dev.</th>
                    </tr>
                </thead>
                <tbody>
                    {data.saleDetails?.map(item => (<>
                        <tr
                            key={item.saleDetailId}
                            className="bg-white hover:bg-blue-50/30 transition-colors duration-150" // Efecto hover sutil
                        >
                            <td className="px-2 py-3">
                                <p className="font-semibold text-gray-800">{item.productNameAtSale}</p>
                                <p className="text-xs text-gray-500">Cat: {item.productCategoryAtSale}</p>
                                <p className="text-xs text-gray-500">Código: {item.productBarCodeAtSale}</p>
                            </td>
                            <td className="px-2 py-3 text-center font-medium">{item.quantity}</td>
                            <td className="px-2 py-3 text-center font-semibold">
                                {numberMoneyFormat(item.regularPriceAtSale)}
                            </td>
                            <td className="px-2 py-3 text-center font-semibold">
                                {numberMoneyFormat(item.subtotalItem+item.discountItem)}
                            </td>
                            <td className="px-2 py-3 text-center font-semibold text-orange-600">
                                {numberMoneyFormat(item.unitPriceAtSale)}
                            </td>
                            <td className="px-2 py-3 text-center text-red-600">
                                -{numberMoneyFormat(item.discountItem)}
                            </td>
                            <td className="px-2 py-3 text-center font-bold text-gray-900">
                                {numberMoneyFormat(item.subtotalItem)}
                            </td>
                            <td className="px-2 py-3 text-center font-bold text-gray-900">
                                { data.status === SaleStatusEnum.COMPLETED && 
                                    (
                                        <RoundedButton onClick={()=> handleSelectDetailToReturn(item)} title='Devolución de producto' color='yellow'>
                                            <IoReturnDownForward/>
                                        </RoundedButton>
                                    )
                                }
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={8}>{ item.returns.map((subItem, i)=> (
                                <div className='flex flex-col w-full p-2 pl-8 mb-2 bg-amber-100 border-2 border-amber-500 rounded-2xl'>
                                    <div className='flex gap-4'>
                                        <h1 className='uppercase font-bold'>{`${i+1} - Devolución`}</h1>
                                        <div>
                                            <span>Cantidad devuelta:</span>
                                            <span className='font-bold'>{` ${subItem.quantityReturn}`}</span>
                                        </div>
                                        <div>
                                            <span>Dinéro devuelto:</span>
                                            <span className='font-bold'>{` ${numberMoneyFormat(subItem.amountReturn)}`}</span>
                                        </div>
                                    </div>
                                    <div className='text-gray-800 text-sm'>
                                        <span>Ejecutó: </span>
                                        <span className='font-semibold'>{` ${subItem.employee?.firstName} ${subItem.employee?.lastName}`}</span>
                                    </div>
                                </div>
                            ))}</td>
                        </tr>
                    </>))}
                </tbody>
            </table>
            <ReturnsPoductsModal/>
        </div>
    )
}

export { SaleDetailList }
