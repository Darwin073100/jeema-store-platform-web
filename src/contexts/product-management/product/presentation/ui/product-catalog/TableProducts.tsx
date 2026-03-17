'use client'
import { useProductStore } from "@/contexts/product-management/product/presentation/stores/product.store";
import { Button } from "@/shared/ui/components/buttons";
import { FiExternalLink } from "react-icons/fi";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { PCol, PrimaryTable, PRow, PTableEmpty } from "@/shared/ui/components/tables/PrimaryTable";
import { useProductActionsBar } from "@/contexts/product-management/product/presentation/hooks/useProductActionsBar";
import clsx from "clsx";

interface TableProductProps {
}

export function TableProduct({}: TableProductProps) {
    const { productsFiltered } = useProductStore();
    const { totalStock, handleViewProduct, productId, handleColorRow} = useProductActionsBar();
    const head = ['Cod. Bar. Uni.', 'Nombre', 'Stock', 'P. Uni.', 'P. May.', 'Categ.'];

    return (
        <div>
            <PrimaryTable theadList={head} isActions={true}>
                {productsFiltered.map(item => (
                    <PRow key={item?.productId || Math.random()} className={clsx(`${handleColorRow(item)}`)} >
                        <PCol>{item?.universalBarCode || '-'}</PCol>
                        <PCol>{item?.name || '-'}</PCol>
                        <PCol>{totalStock(item?.inventory?.inventoryItems ?? [])}</PCol>
                        {/* <PCol>{item?.inventory?.inventoryItems?.[0]?.location || '-'}</PCol> */}
                        {/* <PCol>${item?.lots?.[0]?.purchasePrice || '0.00'}</PCol> */}
                        <PCol>${item?.inventory?.salePriceOne || '0.00'}</PCol>
                        <PCol>${item?.inventory?.salePriceMany || '0.00'}</PCol>
                        <PCol>{item?.category?.name || '-'}</PCol>
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
                {(!productsFiltered || productsFiltered.length === 0) && (
                    <PTableEmpty colsNumber={head.length + 1} />
                )}
            </PrimaryTable>
        </div>
    )
}