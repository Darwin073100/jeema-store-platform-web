'use client'
import React from 'react'
import { useWorkspace } from '@/shared/ui/hooks/auth/useAuth';
import { FcCollaboration, FcComboChart, FcConferenceCall, FcDepartment, FcPrint, FcReadingEbook, FcSerialTasks, FcSettings} from 'react-icons/fc';
import { LinkCardGrid } from './LinkCardGrid';
import { LinkCard } from './LinkCard';
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
                <LinkCardGrid>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <LinkCard 
                            Icon={FcDepartment}
                            value='Establecimiento'
                            link='/configurations/establishment'/>
                        <LinkCard
                            value='Mi perfil'
                            Icon={FcReadingEbook}
                            link={`configurations/employees/${employee?.employeeId}`}/>
                        <LinkCard 
                            value='Usuarios'
                            Icon={FcConferenceCall}
                            link='/configurations/users' />
                        <LinkCard
                            value='Empleados'
                            Icon={FcCollaboration} 
                            link='/configurations/employees' />
                    </HideElement>
                </LinkCardGrid>
            </div>
            <div className="w-full">
                <div className="flex gap-4 items-center mb-4">
                    <FcSerialTasks className="text-xl" />
                    <h2 className="text-lg">Información financiera</h2>
                </div>
                <LinkCardGrid>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <LinkCard
                            value='Movimientos generales'
                            Icon={FcComboChart} 
                            link='/configurations/transactions' />
                    </HideElement>
                </LinkCardGrid>
            </div>
            <div className="w-full mt-8">
                <div className="flex gap-4 items-center mb-4">
                    <FcPrint className="text-xl" />
                    <h2 className="text-lg">Impresiones</h2>
                </div>
                <LinkCardGrid>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <LinkCard
                            value='Impresora térmica'
                            Icon={FcPrint} 
                            link='/configurations/printer' />
                    </HideElement>
                </LinkCardGrid>
            </div>
        </>
    )
}

export { ConfigurationOptions };
