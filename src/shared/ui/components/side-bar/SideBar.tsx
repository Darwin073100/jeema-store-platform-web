'use client'
import React from 'react'
import { FcConferenceCall, FcCurrencyExchange, FcOrgUnit, FcSerialTasks, FcServices } from "react-icons/fc";
import { SideLink } from './SideLink'
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement';
import { useAuth, useWorkspace } from '@/shared/ui/hooks/auth/useAuth';

/**
 * Sidebar de escritorio: rectángulo sólido pegado, colapsado por defecto (solo iconos).
 * Al pasar el cursor sobre el sidebar (clase `group`), se expande y todos los items
 * muestran su texto junto al icono en la misma fila, sin que el icono cambie de posición.
 */
export const SideBar = () => {
    const { user } = useAuth();
    const { establishment, branchOffice } = useWorkspace();

    const workspaceLabel = [establishment?.name, branchOffice?.name].filter(Boolean).join(' · ');

    return (
        <nav className="group sticky top-0 -my-4 max-md:hidden flex w-20 shrink-0 flex-col self-stretch overflow-hidden border-r border-gray-100 bg-white transition-[width] duration-300 ease-out hover:w-64">
            {/* Identidad del usuario: avatar fijo, texto se revela con el mismo hover del sidebar */}
            {/* <div className="flex items-center gap-3 border-b border-gray-100 py-4 pl-5 pr-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {(user?.email?.[0] ?? '?').toUpperCase()}
                </div>
                <div className="flex max-w-0 min-w-0 flex-col overflow-hidden opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:opacity-100">
                    <span className="truncate whitespace-nowrap text-sm font-semibold text-gray-800">
                        {user?.email ?? '--'}
                    </span>
                    <span className="truncate whitespace-nowrap text-xs text-gray-500">
                        {workspaceLabel || '--'}
                    </span>
                </div>
            </div> */}

            {/* Navegación */}
            <div className="flex flex-1 flex-col gap-2 py-4">
                <SideLink Icon={FcOrgUnit} href='/' value='Inicio'/>
                <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                    <SideLink Icon={FcConferenceCall} href='/customers' value='Clientes'/>
                </HideElement>
                <SideLink Icon={FcServices} href='/configurations' value='Config.'/>
                <SideLink Icon={FcCurrencyExchange} href='/cash' value='Caja'/>
                <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                    <SideLink Icon={FcSerialTasks} href='/transfers' value='Traspasos'/>
                </HideElement>
            </div>
        </nav>
    )
}
