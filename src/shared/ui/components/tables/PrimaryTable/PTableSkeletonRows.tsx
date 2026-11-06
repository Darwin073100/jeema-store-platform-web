import React from 'react'
import { Skeleton } from '../../loadings/Skeleton'
import { PCol } from './PCol'
import { PRow } from './PRow'

interface Props {
    colsNumber: number;
    rows?: number;
}

/** Filas de carga para el cuerpo de un `PrimaryTable`; es la contraparte de `PTableEmpty`. */
const PTableSkeletonRows = ({ colsNumber, rows = 8 }: Props) => {
    return (
        <>
            {Array.from({ length: rows }, (_, row) => (
                <PRow key={row} className="bg-white">
                    {Array.from({ length: colsNumber }, (_, col) => (
                        <PCol key={col}><Skeleton className="h-5 w-full max-w-32" /></PCol>
                    ))}
                </PRow>
            ))}
        </>
    )
}

export { PTableSkeletonRows }
