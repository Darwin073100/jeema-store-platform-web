'use client'
import { Button } from "@/shared/ui/components/buttons";
import { FiExternalLink } from "react-icons/fi";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { PCol, PrimaryTable, PRow, PTableEmpty } from "@/shared/ui/components/tables/PrimaryTable";
import { useLotStore } from "../../stores/lot.store";
import { useLotActionsBar } from "../../hooks/useLotActionsBar";
import { formatDateShort } from "@/shared/lib/utils/date-formatter";
import { numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import { Badge } from "@/shared/ui/components/badges/Badge";

interface TableLotsProps {
}

export function TableLotsDesktop({}: TableLotsProps) {
    const { lotsFiltered } = useLotStore();
    const { handleViewProduct, productId } = useLotActionsBar();
    const head = ['FOLIO', 'PRODUCTO', 'PRECIO', 'UNIDAD', 'CANTIDAD', 'TOTAL', 'PROVEEDOR', 'FECHA'];

    return (
        <div>
            <PrimaryTable theadList={head} isActions={true}>
                {lotsFiltered.map(item => (
                    <PRow key={item?.lotId || Math.random()} >
                        <PCol>{item?.lotId || '-'}</PCol>
                        <PCol>{item?.product?.name || '-'}</PCol>
                        <PCol>{numberMoneyFormat(item?.purchasePrice ?? 0)}</PCol>
                        <PCol><Badge>{item?.purchaseUnit.toUpperCase()}</Badge></PCol>
                        <PCol>{item?.initialQuantity || '0'}</PCol>
                        <PCol>{numberMoneyFormat(item.initialQuantity*item.purchasePrice)}</PCol>
                        <PCol>{item?.suplier?.name || 'N/A'}</PCol>
                        <PCol>{formatDateShort(item?.receivedDate)}</PCol>
                        <PCol className="flex justify-end">
                            <Button
                                size="sm"
                                color="yellow"
                                onClick={() => handleViewProduct(item?.productId?.toString() || '')}
                                title="Ver detalles del producto"
                            >
                                {productId===item.productId.toString()
                                    ? <Spinner size={14} />
                                    :<FiExternalLink size={14} /> }
                                <span>Detalles</span>
                            </Button>
                        </PCol>
                    </PRow>
                ))}
                {(!lotsFiltered || lotsFiltered.length === 0) && (
                    <PTableEmpty colsNumber={head.length + 1} />
                )}
            </PrimaryTable>
        </div>
    )
}