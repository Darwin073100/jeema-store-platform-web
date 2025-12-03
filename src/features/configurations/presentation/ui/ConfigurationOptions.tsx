'use client'
import { useWorkspace } from '@/shared/hooks/useAuth';
import Link from 'next/link';
import React from 'react'
import { FcBearish, FcBullish, FcCollaboration, FcComboChart, FcConferenceCall, FcReadingEbook, FcSerialTasks, FcSettings, FcShop } from 'react-icons/fc';
import { ContainerConfig } from './ContainerConfig';
import { ItemConfig } from './ItemConfig';

const ConfigurationOptions = () => {
    const { employee } = useWorkspace();
    return (
        <>
            <div className="w-full mb-8">
                <div className="flex gap-4 items-center mb-4">
                    <FcSettings className="text-xl" />
                    <h2 className="text-lg">General</h2>
                </div>
                <ContainerConfig>
                    <ItemConfig link={`configurations/employees/${employee?.employeeId}`}>
                        <FcReadingEbook className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
                        <span>Mi perfil</span>
                    </ItemConfig>
                    <ItemConfig link='/configurations/users'>
                        <FcConferenceCall className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
                        <span>Usuarios</span>
                    </ItemConfig>
                    <ItemConfig link='/configurations/employees'>
                        <FcCollaboration className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
                        <span>Empleados</span>
                    </ItemConfig>
                    <ItemConfig link='#'>
                        <FcShop className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
                        <span>Sucursales</span>
                    </ItemConfig>
                </ContainerConfig>
            </div>
            <div className="w-full">
                <div className="flex gap-4 items-center mb-4">
                    <FcSerialTasks className="text-xl" />
                    <h2 className="text-lg">Información financiera</h2>
                </div>
                <ContainerConfig>
                    <ItemConfig link='/configurations/transactions'>
                        <FcComboChart className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
                        <span>Movimientos Generales</span>
                    </ItemConfig>
                </ContainerConfig>
            </div>
        </>
    )
}

export { ConfigurationOptions };
