import React from 'react'
import { Card } from '../cards'
import { Skeleton } from './Skeleton'

interface Props {
    items?: number,
}

/** Lista de tarjetas en carga: es la versión móvil de `TableSkeleton`. */
const CardListSkeleton = ({ items = 4 }: Props) => {
    return (
        <>
            {Array.from({ length: items }, (_, item) => (
                <Card key={item} className="w-full">
                    <div className="flex justify-between items-start pb-2 border-b border-gray-100 mb-2">
                        <Skeleton className="h-7 w-32" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-9 w-full mt-3" />
                </Card>
            ))}
        </>
    )
}

export { CardListSkeleton }
