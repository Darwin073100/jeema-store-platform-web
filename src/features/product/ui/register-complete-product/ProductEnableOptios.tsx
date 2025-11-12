'use client'
import { LabelInput } from '@/ui/components/labels'
import React from 'react'
import { FcDeployment, FcFeedIn } from 'react-icons/fc'

interface Props{
    register: any
}

const ProductEnableOptios = ({ register }:Props) => {

    return (
        <div className='flex items-center gap-4 p-4 rounded-xl bg-white mb-4'>
            <div className='flex items-center justify-center gap-2'>
                <FcDeployment />
                <LabelInput value='Habilitar Inventario' />
                <input type='checkbox' {...register('inventoryCheck')} name="inventoryCheck" id="inventoryCheck"
                    className='w-5 h-5' />
            </div>
            <div className='flex items-center justify-center gap-2'>
                <FcFeedIn />
                <LabelInput value='Habilitar lote de compra' />
                <input type='checkbox' {...register('lotCheck')} name="lotCheck" id="lotCheck"
                    className='w-5 h-5' />
            </div>
        </div>
    )
}

export { ProductEnableOptios };
