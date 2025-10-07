'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import Logo from "../../assets/images/logologo.png";
import Sale from '../../../ui/assets/images/sale.svg';
import { IoChevronDownSharp, IoNotifications, IoPeopleOutline } from 'react-icons/io5'
import { RoundedButton } from '../buttons/RoundedButton';
import { RoundedBadge } from '../badges/RoundedBadge';
import { LogoutModal } from '../modals/LogoutModal';
import { useAuth, useWorkspace } from '@/shared/hooks/useAuth';
import { Button } from '../buttons';
import Link from 'next/link';

export const NavBar = () => {
  const { user } = useAuth();
  const { establishment, branchOffice } = useWorkspace();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <nav className="flex justify-between items-center py-3 px-6 bg-white shadow-md hover:shadow-lg transition-all w-full">
      {/* Brand Section */}
      <div className='flex items-center gap-4'>
        <div className="relative group">
          <Image
            className="rounded-lg shadow-sm group-hover:shadow-md transition-all"
            src={Logo}
            alt="Logo de la empresa"
            width={40}
            height={40}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col">
          <h1 className='text-lg font-semibold text-gray-800 max-sm:hidden'>
            {establishment?.name ?? '--'}
          </h1>
          <span className="text-sm text-gray-500 max-sm:hidden">
            {branchOffice?.name}
          </span>
        </div>
        <div>
          <Link
            href='/sale/new'
            className='text-sm flex flex-col items-center justify-center rounded-xl p-1 
                   bg-emerald-500 text-white 
                   hover:bg-emerald-400 shadow 
                   transition-all duration-500' // Cambio aquí
          >
            <Image
              alt='NewSale'
              src={Sale}
              width={30}
              height={30} />
            <span>Nueva Venta</span>
          </Link>
        </div>
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
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg">
            <RoundedBadge color='blue'>
              <IoPeopleOutline className="text-lg" />
            </RoundedBadge>
            <span className='max-sm:hidden text-sm font-medium text-blue-800'>
              {user?.email ?? '--'}
            </span>
          </div>

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
