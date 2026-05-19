'use client'
import clsx from 'clsx'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { IconType } from 'react-icons';
import { Spinner } from '../loadings/Spinner'
// Asegúrate de importar tu componente Spinner
// import { Spinner } from './tu/ruta/al/Spinner';

interface Props{
    hover?: string; // Lo puse opcional por si no lo usas
    Icon: IconType;
    href: string;
    value: string;
    className?: string;
}

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
            // 1. Clases base estructurales (siempre se aplican)
            "px-4 py-1 flex flex-col items-center justify-center rounded-2xl gap-1 transition-all duration-300 cursor-pointer shadow border-2",
            
            // 2. Estilos dinámicos basados en si está ACTIVO o no
            isActive 
                ? "bg-blue-200 border-blue-700 text-blue-900 shadow-xl font-semibold" 
                : "bg-white text-gray-700 border-white hover:shadow-xl hover:bg-blue-200 hover:border-blue-700",
            
            // 3. Clases extras que pases desde el componente padre
            className
        )}
    >
        <span>
            {/* Renderizado condicional para el Spinner o el Icono */}
            {isLoading ? (
                <Spinner color='blue' /> // Reemplaza con tu componente
            ) : (
                <Icon className="text-xl"/>
            )}
        </span>
        <span
            className={clsx(
                "transition-all duration-1000 max-sm:hidden text-sm",
                isActive ? "font-bold" : "font-normal"
            )}>
                {value}
        </span>
    </Link>
  )
}