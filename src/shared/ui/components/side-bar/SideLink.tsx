'use client'
import clsx from 'clsx'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { IconType } from 'react-icons';
import { Spinner } from '../loadings/Spinner'
// import { Spinner } from './tu/ruta/al/Spinner';

interface Props{
    hover?: string;
    Icon: IconType;
    href: string;
    value: string;
}

export const SideLink = ({Icon, href, value}:Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // 1. Verificamos si la ruta actual coincide con el href de este enlace
  const isActive = pathname === href;

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <Link 
        href={href} 
        onClick={(e) => {
            // 2. Solo activamos el estado de carga si NO estamos ya en esa página
            if (!isActive) {
                setIsLoading(true);
            }
        }}
        className={clsx(
            // Clases base que siempre se aplican
            "w-[75px] h-[75px] transition-all duration-300 flex flex-col items-center justify-center rounded-2xl gap-1 cursor-pointer shadow border-2",
            // 3. Estilos si el enlace está ACTIVO
            isActive 
                ? "bg-blue-200 border-blue-700 text-blue-900 shadow-xl font-semibold" 
            // 4. Estilos si el enlace INACTIVO (con sus efectos hover)
                : "bg-white border-white text-gray-700 hover:shadow-xl hover:bg-blue-200 hover:border-blue-700 hover:border-2"
        )}
    >
        <span>
            {isLoading ? (
                <Spinner color='blue' /> 
            ) : (
                <Icon className="text-2xl"/>
            )}
        </span>
        <span
            className={clsx(
                "transition-all duration-1000 max-sm:hidden text-sm",
                // Hacemos el texto un poco más grueso si está activo
                isActive ? "font-bold" : "font-normal"
            )}>
                {value}
        </span>
    </Link>
  )
}