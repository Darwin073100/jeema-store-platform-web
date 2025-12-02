'use client'
import { useWorkspace } from '@/shared/hooks/useAuth';
import Link from 'next/link';
import React from 'react'
import { FcBearish, FcBullish, FcCollaboration, FcComboChart, FcConferenceCall, FcReadingEbook, FcSerialTasks, FcSettings, FcShop } from 'react-icons/fc';

const ConfigurationOptions = () => {
    const { employee } = useWorkspace();
    return (
        <>
            <div className="w-full mb-8">
                <div className="flex gap-4 items-center mb-4">
                    <FcSettings className="text-xl" />
                    <h2 className="text-lg">General</h2>
                </div>
                <div className="flex gap-2">
                    <Link href={`configurations/employees/${employee?.employeeId}`}>
                        <div className="transition-all duration-200 cursor-pointer shadow hover:shadow-xl flex flex-col items-center justify-center bg-white p-4 w-[150px] rounded-2xl">
                            <FcReadingEbook className="w-[50px] h-[50px]" />
                            <span>Mi perfil</span>
                        </div>
                    </Link>
                    <Link href='/configurations/users'>
                        <div className="transition-all duration-200 cursor-pointer shadow hover:shadow-xl flex flex-col items-center justify-center bg-white p-4 w-[150px] rounded-2xl">
                            <FcConferenceCall className="w-[50px] h-[50px]" />
                            <span>Usuarios</span>
                        </div>
                    </Link>
                    <Link href='/configurations/employees'>
                        <div className="transition-all duration-200 cursor-pointer shadow hover:shadow-xl flex flex-col items-center justify-center bg-white p-4 w-[150px] rounded-2xl">
                            <FcCollaboration className="w-[50px] h-[50px]" />
                            <span>Empleados</span>
                        </div>
                    </Link>
                    <div className="transition-all duration-200 cursor-pointer shadow hover:shadow-xl flex flex-col items-center justify-center bg-white p-4 w-[150px] rounded-2xl">
                        <FcShop className="w-[50px] h-[50px]" />
                        <span>Sucursales</span>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="flex gap-4 items-center mb-4">
                    <FcSerialTasks className="text-xl" />
                    <h2 className="text-lg">Información financiera</h2>
                </div>
                <div className="flex gap-2">
                    <Link href='/configurations/transactions'>
                        <div className="transition-all duration-200 cursor-pointer shadow hover:shadow-xl flex flex-col items-center justify-center bg-white p-4 w-[150px] rounded-2xl">
                            <FcComboChart className="w-[50px] h-[50px]" />
                            <span>Movimientos Generales</span>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export { ConfigurationOptions };
