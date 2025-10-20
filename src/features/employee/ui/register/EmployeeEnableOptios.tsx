'use client'
import { LabelInput } from '@/ui/components/labels'
import React from 'react'
import { FcCableRelease, FcReadingEbook } from 'react-icons/fc'
import { useEmployeeForm } from '../../infraestructure/hooks/useEmployeeForm';

const EmployeeEnableOptios = () => {
    const { handleAddressCheck, handleUserCheck } = useEmployeeForm();

    return (
        <div className='flex items-center gap-4 p-4 rounded-xl bg-white'>
            <div className='flex items-center justify-center gap-2'>
                <FcReadingEbook />
                <LabelInput value='Habilitar usuario' />
                <input type='checkbox' onChange={(e)=> handleUserCheck(e)}
                    className='w-5 h-5' />
            </div>
            <div className='flex items-center justify-center gap-2'>
                <FcCableRelease />
                <LabelInput value='Habilitar dirección' />
                <input type='checkbox' onChange={(e)=> handleAddressCheck(e)}
                    className='w-5 h-5' />
            </div>
        </div>
    )
}

export { EmployeeEnableOptios };
