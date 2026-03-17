'use client'
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton';
import React from 'react'
import { AiFillDelete } from 'react-icons/ai';
import { MdEditSquare } from 'react-icons/md';
import { useBrandStore } from '../stores/brand.store';
import { useDeleteBrand } from '../hooks/useDeleteBrand';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';

const BrandTable = () => {
    const { brands, setBrand } = useBrandStore();
    const { deletingBrandId, showConfirmation, confirmDelete, cancelDelete, isDeleting, isConfirming} = useDeleteBrand();
    const head = ['Marca', 'Acciones'];
      
    return (
        <div className='h-60 w-full overflow-auto'>
            <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                <thead className="text-sm text-gray-700 uppercase bg-white">
                    <tr>
                        {head.map(item => <th scope="col" className="px-6 py-3" key={item}>{item}</th>)}
                    </tr>
                </thead>
                <tbody className="border-y border-gray-300">
                    {brands.map(item => (
                        <>
                            <tr className="bg-white border-b border-gray-200" key={item.brandId}>
                                <td className="px-6 py-4">{item.name}</td>
                                <td className="px-6 py-4 flex gap-2 items-center">
                                    <RoundedButton type='button' color="yellow" onClick={() => setBrand(item)}>
                                        <MdEditSquare />
                                    </RoundedButton>
                                    <RoundedButton type='button' onClick={() => showConfirmation(item.brandId)} color="red">
                                        <AiFillDelete />
                                    </RoundedButton>
                                </td>
                            </tr>
                            <tr>
                                {isDeleting && deletingBrandId === item.brandId && (
                                    <td colSpan={2} className="p-4 bg-red-100 text-red-700 " key={`confirm-${item.brandId}`}>
                                        <div className='flex justify-center items-center gap-4'>
                                            <span className='font-semibold'>¿Está seguro de eliminar la marca ( {item.name}) ?</span>
                                            <div className="flex gap-2">
                                                <RoundedButton 
                                                    color='red'
                                                    disabled={isConfirming}
                                                    onClick={() => confirmDelete(item.brandId)}>
                                                    {isConfirming && deletingBrandId === item.brandId ? (
                                                        <Spinner />
                                                    ) : (
                                                        'Sí'
                                                    )}
                                                </RoundedButton>
                                                <RoundedButton
                                                    color='gray'
                                                    disabled={isConfirming}
                                                    onClick={() => cancelDelete()}>
                                                    No
                                                </RoundedButton>
                                            </div>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export { BrandTable }
