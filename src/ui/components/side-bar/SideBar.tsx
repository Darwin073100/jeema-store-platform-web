'use client'
import React, { useState } from 'react'
import { HiHome } from 'react-icons/hi'
import { HiMiniShoppingBag, HiMiniShoppingCart } from 'react-icons/hi2'
import { SiOnlyoffice } from "react-icons/si";
import { SideLink } from './SideLink'
import { FaProductHunt } from 'react-icons/fa';

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
        <SideLink hover={hover} Icon={HiHome} href='/' value='Home'/>
        <SideLink hover={hover} Icon={HiMiniShoppingCart} href='/sale' value='Ventas'/>
        <SideLink hover={hover} Icon={HiMiniShoppingBag} href='#' value='Clientes'/>
        <SideLink hover={hover} Icon={SiOnlyoffice} href='/branch-office' value='Suc.'/>
        <SideLink hover={hover} Icon={FaProductHunt} href='/products' value='Productos'/>
    </form>
  )
}
