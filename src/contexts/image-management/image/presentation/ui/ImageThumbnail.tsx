'use client'
import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { HiOutlinePhotograph } from 'react-icons/hi';

interface Props {
    /** URL pública de la imagen principal, o `null` si el dueño no tiene ninguna. */
    src: string | null;
    /** Texto alternativo descriptivo, obligatorio por accesibilidad. */
    alt: string;
    /** Tamaño (ancho = alto) en píxeles. Default 48. */
    size?: number;
    /** Forma del contenedor. Default 'lg'. */
    rounded?: 'full' | 'lg' | 'md' | 'none';
    className?: string;
}

/**
 * Miniatura de solo lectura para la imagen principal de un dueño
 * (producto, empleado, establecimiento). Muestra un placeholder accesible
 * cuando `src` es `null`, sin disparar ninguna petición de red.
 */
const ImageThumbnail = ({ src, alt, size = 48, rounded = 'lg', className }: Props) => {
    const roundedClass = rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-lg' : rounded === 'md' ? 'rounded-md' : 'rounded-none';

    return (
        <div
            className={clsx(
                'relative overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0',
                roundedClass,
                className
            )}
            style={{ width: size, height: size }}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={`${size}px`}
                    style={{ objectFit: 'cover' }}
                />
            ) : (
                <HiOutlinePhotograph
                    aria-label="Sin imagen"
                    role="img"
                    className="text-gray-400"
                    size={Math.max(16, Math.round(size * 0.5))}
                />
            )}
        </div>
    );
};

export { ImageThumbnail };
