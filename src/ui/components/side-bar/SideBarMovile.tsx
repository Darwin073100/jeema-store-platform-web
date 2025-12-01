'use client'
import React, { useState } from 'react'
import { FcConferenceCall, FcCurrencyExchange, FcMindMap, FcOrgUnit, FcPaid, FcServices, FcShop } from "react-icons/fc";
import { SideMovileLink } from './SideMovileLink';
import { useSideStore } from './side.store';

export const SideBarMovile = () => {
    const [hover, setHover] = useState<string>('sm:hidden');
    const { sideBar, onToggelSideBar } = useSideStore();

    return (<>
        { sideBar && <div className='absolute z-10 w-screen h-screen' onClick={()=> onToggelSideBar() }>
            <form 
                className="fixed md:hidden transition-all duration-300 flex flex-col gap-4 px-4 text-gray-700">
                <SideMovileLink hover={hover} Icon={FcPaid} href='/sale' value='Ventas'/>
                <SideMovileLink hover={hover} Icon={FcOrgUnit} href='/' value='Inicio'/>
                <SideMovileLink hover={hover} Icon={FcMindMap} href='/products' value='Productos'/>
                <SideMovileLink hover={hover} Icon={FcConferenceCall} href='/customers' value='Clientes'/>
                <SideMovileLink hover={hover} Icon={FcServices} href='/configurations' value='Config.'/>
                <SideMovileLink hover={hover} Icon={FcCurrencyExchange} href='/cash' value='Caja'/>
            </form>
        </div>}
    </>)
}
