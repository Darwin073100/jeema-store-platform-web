'use client'
import Image from 'next/image';
import { useState } from 'react';
import Logo from "../../assets/images/logologo.png";
import { IoChevronDownSharp } from 'react-icons/io5'
import { LogoutModal } from '../modals/LogoutModal';
import { useAuth, useWorkspace } from '@/shared/ui/hooks/auth/useAuth';
import { useSideStore } from '../side-bar/side.store';
import clsx from 'clsx';
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement';
import { NavLink } from './NavLink';
import { FcMindMap, FcPaid, FcShipped, FcShop } from 'react-icons/fc';
import { FloatMessage } from '../messages';
import { useFloatMessageStore } from '../messages/stores/useFloatMessageStore';

/**
 * Navbar de escritorio/móvil: mismo lenguaje visual que el SideBar — fondo blanco plano,
 * borde sutil en vez de sombra pesada, filas de navegación en `bg-blue-50`/`text-blue-700`
 * cuando están activas y hover gris cuando no.
 */
export const NavBar = () => {
  const { user } = useAuth();
  const { establishment, branchOffice, employee } = useWorkspace();
  const { floatMessageState } = useFloatMessageStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { onToggelSideBar, sideBar } = useSideStore();

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const userInitial = (employee?.firstName?.[0] ?? user?.email?.[0] ?? '?').toUpperCase();
  const employeeName = [employee?.firstName, employee?.lastName].filter(Boolean).join(' ');

  return (
    <nav className="sticky top-0 z-30 flex w-full items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-2.5">
      {/* Brand Section */}
      <div className='flex items-center gap-4'>
        <button
          type="button"
          onClick={() => onToggelSideBar()}
          aria-label={sideBar ? 'Cerrar menú' : 'Abrir menú'}
          className="shrink-0 rounded-lg p-1 transition-colors duration-150 hover:bg-gray-100 md:cursor-default md:hover:bg-transparent"
        >
          <Image
            className={clsx(
              'max-sm:h-9 max-sm:w-9 rounded-lg transition-transform duration-300',
              sideBar ? 'rotate-90' : 'rotate-0',
              'md:rotate-0'
            )}
            src={Logo}
            alt="Logo de la empresa"
            width={42}
            height={42}
            style={{width: 'auto'}}
            priority
          />
        </button>
        <div className='hidden flex-col lg:flex'>
          <h1 className='truncate text-sm font-semibold text-gray-800'>
            {establishment?.name ?? '--'}
          </h1>
          <span className="truncate text-xs text-gray-500">
            {branchOffice?.name}
          </span>
        </div>
        <div className='hidden items-center gap-1 md:flex'>
          <NavLink Icon={FcPaid} href='/sale/new' value='Nueva Venta' />
          <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
            <NavLink Icon={FcShop} href='/sale' value='Ventas' />
          </HideElement>
          <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
            <NavLink Icon={FcShipped} href='/purchases' value='Compras' />
          </HideElement>
          <NavLink Icon={FcMindMap} href='/products' value='Productos' />
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={handleOpenLogoutModal}
          aria-label="Cerrar sesión"
          className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 transition-colors duration-150 hover:bg-gray-100"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {userInitial}
          </div>
          <div className="hidden flex-col items-start sm:flex">
            <span className="truncate text-sm font-medium text-gray-800">
              {employeeName || '--'}
            </span>
            <span className="text-xs text-gray-500">
              Cerrar sesión
            </span>
          </div>
          <IoChevronDownSharp className="hidden text-gray-400 sm:block" />
        </button>
      </div>

      {/* Modal de Logout */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
      />
      <FloatMessage
        key='nav-bar'
        {...floatMessageState} />
    </nav>
  )
}
