import React from 'react'
import { Skeleton } from './Skeleton'

interface Props {
    children?: React.ReactNode,
}

/**
 * Esqueleto de página para los `loading.tsx`. Replica la estructura de `TemplateHeader` para que el
 * contenido no salte al cargar, y aparece con un retraso breve para no parpadear en respuestas rápidas.
 *
 * @param {React.ReactNode} props.children - Skeleton del contenido propio de la página.
 */
const PageSkeleton = ({ children }: Props) => {
    return (
        <main role="status" aria-busy="true" className="flex flex-col gap-6 w-full min-h-screen bg-gray-50 px-2 max-md:px-1 animate-skeleton-reveal">
            <span className="sr-only">Cargando...</span>
            <div className="max-w-10xl px-2 max-md:px-2">
                {/* Breadcrumb */}
                <Skeleton className="h-5 w-32 mb-1" />

                {/* Título y descripción */}
                <div className="mb-2">
                    <Skeleton className="h-8 w-56 max-w-full" />
                    <Skeleton className="h-4 w-full max-w-xl my-2" />
                </div>
                {children}
            </div>
        </main>
    )
}

export { PageSkeleton }
