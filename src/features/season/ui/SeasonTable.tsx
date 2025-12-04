'use client'
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton';
import React from 'react'
import { AiFillDelete } from 'react-icons/ai';
import { MdEditSquare } from 'react-icons/md';
import { useSeasonStore } from '../infraestructure/season.store';
import { useDeleteSeason } from '../hooks/useDeleteSeason';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';

const SeasonTable = () => {
    const { seasons, setSeason } = useSeasonStore();
    const { deletingSeasonId, showConfirmation, confirmDelete, cancelDelete, isDeleting, isConfirming} = useDeleteSeason();
    const head = ['Categoria', 'Descripción', 'Fech. Ini.', 'Fech. Term.', 'Acciones'];

    return (
        <div className='h-60 w-full overflow-auto'>
            <table className="w-[600px] text-sm text-left rtl:text-right text-gray-700">
                <thead className="text-sm text-gray-700 uppercase bg-white">
                    <tr>
                        {head.map(item => <th scope="col" className="px-6 py-3" key={item}>{item}</th>)}
                    </tr>
                </thead>
                <tbody className="border-y border-gray-300">
                    {seasons.map(item => (
                        <>
                            <tr className="bg-white border-b border-gray-200" key={item.seasonId}>
                                <td className="px-6 py-4">{item.name}</td>
                                <td className="px-6 py-4">{item.description}</td>
                                <td className="px-6 py-4">{`${item.dateInit}`}</td>
                                <td className="px-6 py-4">{`${item.dateFinish}`}</td>
                                <td className="px-6 py-4 flex gap-2 items-center">
                                    <RoundedButton type='button' color="yellow" onClick={() => setSeason(item)}>
                                        <MdEditSquare />
                                    </RoundedButton>
                                    <RoundedButton type='button' onClick={() => showConfirmation(item.seasonId)} color="red">
                                        <AiFillDelete />
                                    </RoundedButton>
                                </td>
                            </tr>
                            <tr>
                                {isDeleting && deletingSeasonId === item.seasonId && (
                                    <td colSpan={5} className="p-4 bg-red-100 text-red-700 " key={item.seasonId}>
                                        <div className='flex justify-center items-center gap-4'>
                                            <span className='font-semibold'>¿Está seguro de eliminar la temporada ( {item.name}) ?</span>
                                            <div className="flex gap-2">
                                                <RoundedButton 
                                                    color='red'
                                                    disabled={isConfirming}
                                                    onClick={() => confirmDelete(item.seasonId)}>
                                                    {isConfirming && deletingSeasonId === item.seasonId ? (
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

export { SeasonTable };
