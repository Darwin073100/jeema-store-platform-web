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
    hover?: string;
    Icon: IconType;
    href: string;
    value: string;
}

export const SideMovileLink = ({Icon, href, value}:Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Verificamos si la ruta actual coincide con el href de este enlace
  const isActive = pathname === href;

  // Apagamos el spinner cuando la navegación termina
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <Link 
        href={href} 
        onClick={(e) => {
            // Solo activamos el estado de carga si NO estamos ya en esa página
            if (!isActive) {
                setIsLoading(true);
            }
        }}
        className={clsx(
            // Clases base que se aplican siempre
            "flex py-2 px-4 items-center justify-start rounded-lg gap-2 transition-all duration-200 cursor-pointer shadow-md",
            // Estilos si está ACTIVO
            isActive 
                ? "bg-blue-100 text-blue-700 font-semibold shadow-inner" 
            // Estilos si está INACTIVO
                : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl"
        )}
    >
        <span>
            {/* Renderizado condicional del Spinner o el Icono */}
            {isLoading ? (
                <Spinner color='blue' /> // Reemplaza esto con tu componente real
            ) : (
                <Icon className="text-2xl"/>
            )}
        </span>
        <span
            className={clsx(
                "transition-all duration-1000 text-sm",
                // Si quieres que el texto haga algún cambio extra al estar activo, puedes agregarlo aquí
            )}>
                {value}
        </span>
    </Link>
  )
}