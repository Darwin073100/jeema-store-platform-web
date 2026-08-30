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
    onNavigate?: () => void;
}

export const SideMovileLink = ({Icon, href, value, onNavigate}:Props) => {
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
        onClick={() => {
            // Solo activamos el estado de carga si NO estamos ya en esa página
            if (!isActive) {
                setIsLoading(true);
            }
            // Cierra el panel móvil al navegar, para no dejarlo abierto sobre la página destino
            onNavigate?.();
        }}
        className={clsx(
            // Clases base: fila de lista plana, sin card ni sombra propia
            "flex py-3 px-3 items-center justify-start rounded-xl gap-3 transition-colors duration-150 cursor-pointer",
            // Estilos si está ACTIVO: pill de selección, sin sombra
            isActive
                ? "bg-blue-50 text-blue-700 font-semibold"
            // Estilos si está INACTIVO: sin fondo, solo hover sutil
                : "text-gray-700 hover:bg-gray-50"
        )}
    >
        <span className="flex w-7 items-center justify-center shrink-0">
            {/* Renderizado condicional del Spinner o el Icono */}
            {isLoading ? (
                <Spinner color='blue' /> // Reemplaza esto con tu componente real
            ) : (
                <Icon className="text-2xl"/>
            )}
        </span>
        <span className="text-sm">
                {value}
        </span>
    </Link>
  )
}