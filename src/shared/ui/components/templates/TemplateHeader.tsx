'use client'
import React from 'react'
import { Breadcrumb } from '../navigation'

export interface BreadcrumbItem {
    label: string,
    href?: string
}

interface Props {
    breadcrumbItems: BreadcrumbItem[],
    title: string,
    children?: any,
    detail: string,
}

/**
 * Componente `TemplateHeader`
 *
 * Renderiza un encabezado de plantilla que incluye un breadcrumb de navegación,
 * un título principal y un área para contenido adicional (children).
 * Utiliza un fondo con gradiente y estilos responsivos.
 *
 * @param {Props} props - Propiedades del componente.
 * @param {BreadcrumbItem[]} props.breadcrumbItems - Lista de elementos para el breadcrumb de navegación.
 * @param {string} props.title - Título principal que se muestra en el encabezado.
 * @param {React.ReactNode} props.children - Elementos secundarios o contenido adicional que se renderiza debajo del encabezado.
 */
const TemplateHeader = ({ breadcrumbItems, title, detail, children }: Props) => {
    return (
        <main className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 max-md:p-1">
            <div className="max-w-10xl p-6 max-md:p-2 space-y-4">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                {/* Header con título y acciones */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        <p className="text-gray-600 mt-1">{ detail }</p>
                    </div>
                </div>
                {children}
            </div>
        </main>
    )
}

export { TemplateHeader };
