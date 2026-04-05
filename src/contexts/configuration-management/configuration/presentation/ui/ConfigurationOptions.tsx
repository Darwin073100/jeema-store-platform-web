'use client'
import React from 'react'
import { useWorkspace } from '@/shared/presentation/hooks/auth/useAuth';
import { FcCollaboration, FcComboChart, FcConferenceCall, FcDepartment, FcReadingEbook, FcSerialTasks, FcSettings} from 'react-icons/fc';
import { ContainerConfig } from './ContainerConfig';
import { ItemConfig } from './ItemConfig';
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement';

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
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <ItemConfig link='/configurations/establishment'>
                            <FcDepartment className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
                            <span>Establecimiento</span>
                        </ItemConfig>
                    </HideElement>
                    <ItemConfig link={`configurations/employees/${employee?.employeeId}`}>
                        <FcReadingEbook className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
                        <span>Mi perfil</span>
                    </ItemConfig>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <ItemConfig link='/configurations/users'>
                            <FcConferenceCall className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
                            <span>Usuarios</span>
                        </ItemConfig>
                        <ItemConfig link='/configurations/employees'>
                            <FcCollaboration className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
                            <span>Empleados</span>
                        </ItemConfig>
                    </HideElement>
                </ContainerConfig>
            </div>
            <div className="w-full">
                <div className="flex gap-4 items-center mb-4">
                    <FcSerialTasks className="text-xl" />
                    <h2 className="text-lg">Información financiera</h2>
                </div>
                <ContainerConfig>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <ItemConfig link='/configurations/transactions'>
                            <FcComboChart className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
                            <span>Movimientos Generales</span>
                        </ItemConfig>
                    </HideElement>
                </ContainerConfig>
            </div>
        </>
    )
}

export { ConfigurationOptions };
