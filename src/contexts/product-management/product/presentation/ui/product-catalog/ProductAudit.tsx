'use client'
import React from 'react'
import { MdLowPriority } from 'react-icons/md';
import { useProductStore } from '../../stores/product.store';
import { Button } from '@/shared/ui/components/buttons';

const ProductAudit = () => {
    const { lowStock, setLowStock } = useProductStore();
    return (
        <div className='flex justify-between items-center gap-2'>
        {/* <Button
            onClick={()=> setLowStock(!lowStock)}
            size='sm' color='red'>
            <MdLowPriority/>
            Bajo stock
        </Button> */}
        </div>
    )
}

export { ProductAudit };