'use client'
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';
import React from 'react'
import { MdLowPriority } from 'react-icons/md';
import { useProductStore } from '../../infraestructure/stores/product.store';
import clsx from 'clsx';

const ProductAudit = () => {
    const { lowStock, setLowStock } = useProductStore();
    return (
        <div className='flex justify-between items-center gap-2'>
        <ButtonOutLine
            onClick={()=> setLowStock(!lowStock)}
            size='sm' color='red' className={clsx(`duration-75 ${lowStock? 'bg-red-600 text-white': ''}`)}>
            <MdLowPriority/>
            Bajo stock
        </ButtonOutLine>
        </div>
    )
}

export { ProductAudit };