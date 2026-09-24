'use client'
import clsx from 'clsx'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { IconType } from 'react-icons';
import { Spinner } from '../loadings/Spinner'

interface Props{
    Icon: IconType;
    href: string;
    value: string;
    className?: string;
}

/** Enlace del navbar horizontal: mismo lenguaje visual plano que SideLink (pill azul cuando está activo, hover gris sutil, sin bordes ni sombras propias). */
export const NavLink = ({Icon, href, value, className}:Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Verificamos si estamos en la ruta actual
  const isActive = pathname === href;

  // Apagamos el spinner cuando la navegación se completa
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <Link
        href={href}
        onClick={() => {
            // Solo cargamos si no estamos ya en esa página
            if (!isActive) {
                setIsLoading(true);
            }
        }}
        className={clsx(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
            isActive
                ? 'bg-blue-50 font-semibold text-blue-700'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
            className
        )}
    >
        <span className="flex w-5 shrink-0 items-center justify-center">
            {isLoading ? (
                <Spinner color='blue' />
            ) : (
                <Icon className="text-xl"/>
            )}
        </span>
        <span className="whitespace-nowrap">
            {value}
        </span>
    </Link>
  )
}
