import React from 'react'
import { PrimaryTable, PTableSkeletonRows } from '../tables/PrimaryTable'

interface Props {
    theadList: string[],
    isActions?: boolean,
    rows?: number,
}

/** Tabla completa en carga: conserva la cabecera real de `PrimaryTable` y solo sustituye las filas. */
const TableSkeleton = ({ theadList, isActions = true, rows }: Props) => {
    return (
        <PrimaryTable theadList={theadList} isActions={isActions}>
            <PTableSkeletonRows colsNumber={theadList.length + (isActions ? 1 : 0)} rows={rows} />
        </PrimaryTable>
    )
}

export { TableSkeleton }
