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
}

/** Fila del sidebar de escritorio: el icono queda fijo a la izquierda; el texto se revela junto a él cuando el cursor pasa sobre todo el sidebar (clase `group` en SideBar). */
export const SideLink = ({Icon, href, value}:Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Verificamos si la ruta actual coincide con el href de este enlace
  const isActive = pathname === href;

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <Link
        href={href}
        onClick={() => {
            // Solo activamos el estado de carga si NO estamos ya en esa página
            if (!isActive) {
                setIsLoading(true);
            }
        }}
        className={clsx(
            'relative flex items-center gap-3 py-2.5 pl-7 pr-4 transition-colors duration-150',
            isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
        )}
    >
        {/* Barra de acento pegada al borde izquierdo del sidebar cuando está activo */}
        <span
            className={clsx(
                'absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 transition-opacity',
                isActive ? 'opacity-100' : 'opacity-0'
            )}
        />

        {/* El icono nunca cambia de tamaño ni posición entre colapsado/expandido */}
        <span className="flex w-6 shrink-0 items-center justify-center">
            {isLoading ? (
                <Spinner color='blue' />
            ) : (
                <Icon className="text-2xl" />
            )}
        </span>

        {/* Texto: oculto por defecto, se revela junto al icono al pasar el cursor por el sidebar */}
        <span
            className={clsx(
                'max-w-0 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:opacity-100',
                isActive && 'font-semibold'
            )}
        >
            {value}
        </span>
    </Link>
  )
}
