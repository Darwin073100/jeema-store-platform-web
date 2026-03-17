'use client'
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton';
import React from 'react'
import { AiFillDelete } from 'react-icons/ai';
import { MdEditSquare } from 'react-icons/md';
import { useCategoryStore } from '../stores/category.store';
import { useDeleteCategory } from '../hooks/useDeleteCategory';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';

const CategoryTable = () => {
    const { categories, setCategory } = useCategoryStore();
    const { deletingCategoryId, showConfirmation, confirmDelete, cancelDelete, isDeleting, isConfirming} = useDeleteCategory();
    const head = ['Categoria', 'Descripción', 'Acciones'];

    return (
        <div className='h-60 w-full overflow-auto'>
            <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                <thead className="text-sm text-gray-700 uppercase bg-white">
                    <tr>
                        {head.map(item => <th scope="col" className="px-6 py-3" key={item}>{item}</th>)}
                    </tr>
                </thead>
                <tbody className="border-y border-gray-300">
                    {categories.map(item => (
                        <>
                            <tr className="bg-white border-b border-gray-200" key={item.categoryId}>
                                <td className="px-6 py-4">{item.name}</td>
                                <td className="px-6 py-4">{item.description}</td>
                                <td className="px-6 py-4 flex gap-2 items-center">
                                    <RoundedButton type='button' color="yellow" onClick={() => setCategory(item)}>
                                        <MdEditSquare />
                                    </RoundedButton>
                                    <RoundedButton type='button' onClick={() => showConfirmation(item.categoryId)} color="red">
                                        <AiFillDelete />
                                    </RoundedButton>
                                </td>
                            </tr>
                            <tr>
                                {isDeleting && deletingCategoryId === item.categoryId && (
                                    <td colSpan={3} className="p-4 bg-red-100 text-red-700 " key={item.categoryId}>
                                        <div className='flex justify-center items-center gap-4'>
                                            <span className='font-semibold'>¿Está seguro de eliminar la categoría ( {item.name}) ?</span>
                                            <div className="flex gap-2">
                                                <RoundedButton 
                                                    color='red'
                                                    disabled={isConfirming}
                                                    onClick={() => confirmDelete(item.categoryId)}>
                                                    {isConfirming && deletingCategoryId === item.categoryId ? (
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

export { CategoryTable };
