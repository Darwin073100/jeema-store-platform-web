'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import Logo from "../../assets/images/logologo.png";
import { IoChevronDownSharp, IoNotifications } from 'react-icons/io5'
import { RoundedButton } from '../buttons/RoundedButton';
import { LogoutModal } from '../modals/LogoutModal';
import { useAuth, useWorkspace } from '@/shared/presentation/hooks/auth/useAuth';
import { Button } from '../buttons';
import { useSideStore } from '../side-bar/side.store';
import clsx from 'clsx';
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement';
import { NavLink } from './NavLink';
import { FcMindMap, FcPaid, FcShipped, FcShop } from 'react-icons/fc';

export const NavBar = () => {
  const { user } = useAuth();
  const { establishment, branchOffice } = useWorkspace();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { onToggelSideBar, sideBar } = useSideStore();

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <nav className="flex justify-between items-center py-1.5 px-4 bg-white shadow-md hover:shadow-lg transition-all w-full">
      {/* Brand Section */}
      <div className='flex items-center gap-4'>
        <div className={clsx(`relative group ${sideBar? 'rotate-90': 'rotate-0'} transition-all duration-300 md:rotate-0`)} onClick={()=> onToggelSideBar()}>
          <Image
            className="rounded-lg shadow-sm group-hover:shadow-md transition-all"
            src={Logo}
            alt="Logo de la empresa"
            width={50}
            height={50}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col">
          <h1 className='text-lg font-semibold text-gray-800 max-sm:hidden max-md:hidden max-lg:text-sm'>
            {establishment?.name ?? '--'}
          </h1>
          <span className="text-sm text-gray-500 max-sm:hidden">
            {branchOffice?.name}
          </span>
        </div>
        <NavLink hover='' Icon={FcPaid} href='/sale/new' value='Nueva Venta'/>
        <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
          <NavLink  hover='' Icon={FcShop} href='/sale' value='Ventas'/>
        </HideElement>
        <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
          <NavLink  hover='' Icon={FcShipped} href='/purchases' value='Compras'/>
        </HideElement>
        <NavLink hover='' Icon={FcMindMap} href='/products' value='Productos'/>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <RoundedButton
            color='blue'
          >
            <IoNotifications className="text-xl" />
          </RoundedButton>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
            3
          </span>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          <span className='max-sm:hidden text-sm font-medium text-blue-800'>
            {user?.email ?? '--'}
          </span>

          <Button
            color='red'
            onClick={handleOpenLogoutModal}
          >
            <IoChevronDownSharp className="text-lg" />
          </Button>
        </div>
      </div>

      {/* Modal de Logout */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
      />
    </nav>
  )
}
