'use client'
import React, { useState } from 'react'
import { FcConferenceCall, FcCurrencyExchange, FcMindMap, FcOrgUnit, FcPaid, FcServices, FcShop } from "react-icons/fc";
import { SideLink } from './SideLink'

export const SideBar = () => {
    const [hover, setHover] = useState<string>('sm:hidden');

    const handleMouseHover =()=>{
        setHover('sm:flex')
    }

    const handleMouseOut = ()=> {
        setHover('sm:hidden');
    }

    return (
    <form 
        className="max-sm:hidden transition-all duration-300 flex flex-col gap-4 px-4 text-gray-700">
        <SideLink hover={hover} Icon={FcOrgUnit} href='/' value='Inicio'/>
        <SideLink hover={hover} Icon={FcPaid} href='/sale' value='Ventas'/>
        <SideLink hover={hover} Icon={FcMindMap} href='/products' value='Productos'/>
        <SideLink hover={hover} Icon={FcConferenceCall} href='/customers' value='Clientes'/>
        <SideLink hover={hover} Icon={FcServices} href='/configurations' value='Config.'/>
        <SideLink hover={hover} Icon={FcCurrencyExchange} href='/cash' value='Caja'/>
    </form>
  )
}
