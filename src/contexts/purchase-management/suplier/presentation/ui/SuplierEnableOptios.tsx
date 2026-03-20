'use client'
import { LabelInput } from '@/shared/ui/components/labels'
import React from 'react'
import { FcCableRelease } from 'react-icons/fc'

interface Props{
    register: any
}

const SuplierEnableOptios = ({ register }:Props) => {

    return (
        <div className='flex items-center gap-4 p-4 rounded-xl bg-white'>
            <div className='flex items-center justify-center gap-2'>
                <FcCableRelease />
                <LabelInput value='Habilitar dirección' />
                <input type='checkbox' {...register('addressCheck')} name="addressCheck" id="addressCheck"
                    className='w-5 h-5' />
            </div>
        </div>
    )
}

export { SuplierEnableOptios };
