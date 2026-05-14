'use client'
import React, { useState } from 'react'
import { FcConferenceCall, FcCurrencyExchange, FcMindMap, FcOrgUnit, FcPaid, FcSerialTasks, FcServices, FcShipped, FcShop } from "react-icons/fc";
import { SideMovileLink } from './SideMovileLink';
import { useSideStore } from './side.store';
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement';

export const SideBarMovile = () => {
    const [hover, setHover] = useState<string>('sm:hidden');
    const { sideBar, onToggelSideBar } = useSideStore();

    return (<>
        {sideBar && <div className='absolute z-10 w-screen h-screen bg-[#0000002d]' onClick={() => onToggelSideBar()}>
            <form
                className="fixed md:hidden transition-all duration-300 flex flex-col gap-4 px-4 text-gray-700">
                <SideMovileLink hover={hover} Icon={FcOrgUnit} href='/' value='Inicio' />
                <SideMovileLink hover='' Icon={FcPaid} href='/sale/new' value='Nueva Venta' />
                <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                    <SideMovileLink hover={hover} Icon={FcShop} href='/sale' value='Ventas' />
                </HideElement>
                <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                    <SideMovileLink hover='' Icon={FcShipped} href='/purchases' value='Compras' />
                </HideElement>
                <SideMovileLink hover={hover} Icon={FcMindMap} href='/products' value='Productos' />
                <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                    <SideMovileLink hover={hover} Icon={FcConferenceCall} href='/customers' value='Clientes' />
                </HideElement>
                <SideMovileLink hover={hover} Icon={FcServices} href='/configurations' value='Config.' />
                <SideMovileLink hover={hover} Icon={FcCurrencyExchange} href='/cash' value='Caja' />
                <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                    <SideMovileLink hover={hover} Icon={FcSerialTasks} href='/transfers' value='Traspasos'/>
                </HideElement>
            </form>
        </div>}
    </>)
}
