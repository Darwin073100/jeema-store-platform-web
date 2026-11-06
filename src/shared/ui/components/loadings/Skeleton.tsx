import clsx from 'clsx'
import React from 'react'

interface Props {
    className?: string,
}

/**
 * Bloque base de un skeleton. El tamaño y la forma se definen con `className`.
 * Es decorativo: el anuncio de carga para lectores de pantalla lo hace `PageSkeleton`.
 */
const Skeleton = ({ className }: Props) => {
    return (
        <div aria-hidden="true" className={clsx('animate-pulse motion-reduce:animate-none rounded-md bg-gray-200', className)} />
    )
}

export { Skeleton }
