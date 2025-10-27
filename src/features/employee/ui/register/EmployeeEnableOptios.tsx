'use client'
import { LabelInput } from '@/ui/components/labels'
import React from 'react'
import { FcCableRelease, FcReadingEbook } from 'react-icons/fc'

interface Props{
    register: any
}

const EmployeeEnableOptios = ({ register }:Props) => {

    return (
        <div className='flex items-center gap-4 p-4 rounded-xl bg-white'>
            {/* <div className='flex items-center justify-center gap-2'>
                <FcReadingEbook />
                <LabelInput value='Habilitar usuario' />
                <input type='checkbox' {...register('userCheck')} name="userCheck" id="userCheck"
                    className='w-5 h-5' />
            </div> */}
            <div className='flex items-center justify-center gap-2'>
                <FcCableRelease />
                <LabelInput value='Habilitar dirección' />
                <input type='checkbox' {...register('addressCheck')} name="addressCheck" id="addressCheck"
                    className='w-5 h-5' />
            </div>
        </div>
    )
}

export { EmployeeEnableOptios };
