'use client'
import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { FcConferenceCall, FcCurrencyExchange, FcMindMap, FcOrgUnit, FcPaid, FcSerialTasks, FcServices, FcShipped, FcShop } from "react-icons/fc";
import { SideMovileLink } from './SideMovileLink';
import { useSideStore } from './side.store';
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement';
import { useAuth, useWorkspace } from '@/shared/presentation/hooks/auth/useAuth';

const DEFAULT_NAV_HEIGHT = 64;

export const SideBarMovile = () => {
    const { sideBar, closeSideBar } = useSideStore();
    const { user } = useAuth();
    const { establishment, branchOffice } = useWorkspace();
    const [navHeight, setNavHeight] = useState(DEFAULT_NAV_HEIGHT);
    const [isPanelVisible, setIsPanelVisible] = useState(false);

    // Medimos la altura real del NavBar (no es fixed/sticky, vive en el flujo normal)
    // para anclar el panel justo debajo de él y nunca taparlo, sin tener que tocar NavBar.tsx.
    useEffect(() => {
        if (!sideBar) return;

        const updateNavHeight = () => {
            const nav = document.querySelector('nav');
            if (nav) {
                setNavHeight(nav.getBoundingClientRect().height);
            }
        };
        updateNavHeight();
        window.addEventListener('resize', updateNavHeight);
        return () => window.removeEventListener('resize', updateNavHeight);
    }, [sideBar]);

    // Anima la entrada del panel (translate-x) sin depender de plugins de animación externos.
    useEffect(() => {
        if (!sideBar) {
            setIsPanelVisible(false);
            return;
        }
        const raf = requestAnimationFrame(() => setIsPanelVisible(true));
        return () => cancelAnimationFrame(raf);
    }, [sideBar]);

    if (!sideBar) return null;

    const workspaceLabel = [establishment?.name, branchOffice?.name].filter(Boolean).join(' · ');

    return (
        <div
            className="fixed inset-x-0 bottom-0 z-40 bg-black/30 md:hidden"
            style={{ top: navHeight }}
            onClick={() => closeSideBar()}
            role="presentation"
        >
            <div
                className={`flex h-full w-[82%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-200 ease-out ${isPanelVisible ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header: identidad del usuario / workspace, como en Lyft y Messenger */}
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 pt-5 pb-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                            {(user?.email?.[0] ?? '?').toUpperCase()}
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-semibold text-gray-800">
                                {user?.email ?? '--'}
                            </span>
                            <span className="truncate text-xs text-gray-500">
                                {workspaceLabel || '--'}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => closeSideBar()}
                        aria-label="Cerrar menú"
                        className="shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <IoClose className="text-xl" />
                    </button>
                </div>

                {/* Lista de navegación: filas planas, sin cards flotando */}
                <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                    <SideMovileLink Icon={FcOrgUnit} href='/' value='Inicio' onNavigate={closeSideBar} />
                    <SideMovileLink Icon={FcPaid} href='/sale/new' value='Nueva Venta' onNavigate={closeSideBar} />
                    <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                        <SideMovileLink Icon={FcShop} href='/sale' value='Ventas' onNavigate={closeSideBar} />
                    </HideElement>
                    <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                        <SideMovileLink Icon={FcShipped} href='/purchases' value='Compras' onNavigate={closeSideBar} />
                    </HideElement>
                    <SideMovileLink Icon={FcMindMap} href='/products' value='Productos' onNavigate={closeSideBar} />
                    <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                        <SideMovileLink Icon={FcConferenceCall} href='/customers' value='Clientes' onNavigate={closeSideBar} />
                    </HideElement>
                    <SideMovileLink Icon={FcServices} href='/configurations' value='Config.' onNavigate={closeSideBar} />
                    <SideMovileLink Icon={FcCurrencyExchange} href='/cash' value='Caja' onNavigate={closeSideBar} />
                    <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                        <SideMovileLink Icon={FcSerialTasks} href='/transfers' value='Traspasos' onNavigate={closeSideBar} />
                    </HideElement>
                </div>
            </div>
        </div>
    )
}
