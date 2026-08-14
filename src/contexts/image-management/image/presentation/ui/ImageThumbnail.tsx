'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi';
import { Modal } from '@/shared/ui/components/modals/Modal';

interface Props {
    /** URL pública de la imagen principal, o `null` si el dueño no tiene ninguna. */
    src: string | null;
    /** Texto alternativo descriptivo, obligatorio por accesibilidad. */
    alt: string;
    /** Tamaño (ancho = alto) en píxeles. Default 48. */
    size?: number;
    /** Forma del contenedor. Default 'lg'. */
    rounded?: 'full' | 'lg' | 'md' | 'none';
    /**
     * Cuando es `true` y hay una imagen real (`src !== null`), la miniatura se
     * vuelve clicable y abre un modal con la imagen a mayor tamaño. No aplica
     * sobre el placeholder (sin imagen). Default `false`.
     */
    zoomable?: boolean;
    className?: string;
}

/**
 * Miniatura de solo lectura para la imagen principal de un dueño
 * (producto, empleado, establecimiento). Muestra un placeholder accesible
 * cuando `src` es `null`, sin disparar ninguna petición de red.
 */
/**
 * `next/image` construye un `URL` a partir de `src` y lanza en vez de
 * fallar con gracia si el valor no es una URL absoluta ni una ruta que
 * empieza con `/` — puede pasar con datos ya persistidos que no son una URL
 * válida (p. ej. un valor corrupto guardado antes de una corrección). Se
 * trata como "sin imagen" en vez de tumbar toda la pantalla que renderiza
 * la miniatura.
 */
const isDisplayableSrc = (value: string | null): value is string => {
    if (!value) return false;
    if (value.startsWith('/')) return true;
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const ImageThumbnail = ({ src: rawSrc, alt, size = 48, rounded = 'lg', zoomable = false, className }: Props) => {
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const src = isDisplayableSrc(rawSrc) ? rawSrc : null;
    const roundedClass = rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-lg' : rounded === 'md' ? 'rounded-md' : 'rounded-none';
    const canZoom = zoomable && src !== null;

    useEffect(() => {
        if (!isZoomOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsZoomOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZoomOpen]);

    const content = (
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

    if (!canZoom) {
        return content;
    }

    return (
        <>
            <button
                type="button"
                onClick={(event) => {
                    // Varios usos de este componente viven dentro de filas/tarjetas
                    // que también son clicables (selección, navegación) — evitamos
                    // que abrir el zoom dispare esas acciones del contenedor padre.
                    event.stopPropagation();
                    setIsZoomOpen(true);
                }}
                aria-label="Ver imagen más grande"
                className={clsx('cursor-zoom-in shrink-0', roundedClass)}
                style={{ width: size, height: size }}
            >
                {content}
            </button>

            <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)}>
                <div className="relative bg-white rounded-xl shadow-xl p-2">
                    <button
                        type="button"
                        onClick={() => setIsZoomOpen(false)}
                        aria-label="Cerrar"
                        className="cursor-pointer absolute -top-3 -right-3 bg-white text-gray-600 hover:text-gray-900 rounded-full p-1.5 shadow border border-gray-200"
                    >
                        <HiOutlineX size={20} />
                    </button>
                    {src && (
                        <div className="relative w-[90vw] max-w-[560px] h-[90vw] max-h-[560px]">
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                sizes="560px"
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export { ImageThumbnail };
