'use client'
import { useProductStore } from "@/contexts/product-management/product/presentation/stores/product.store";
import { Button } from "@/shared/ui/components/buttons";
import { FiExternalLink } from "react-icons/fi";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { PCol, PrimaryTable, PRow, PTableEmpty } from "@/shared/ui/components/tables/PrimaryTable";
import { useProductActionsBar } from "@/contexts/product-management/product/presentation/hooks/useProductActionsBar";
import clsx from "clsx";
import { ButtonOutLine } from "@/shared/ui/components/buttons/ButtonOutLine";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import Link from "next/link";
import { ImageThumbnail } from "@/contexts/image-management/image/presentation/ui";

interface ListMovileProductsProps {
}

export function ListMovileProducts({}: ListMovileProductsProps) {
    const { productsFiltered } = useProductStore();
    const { totalStock, handleViewProduct, productId, handleColorRow} = useProductActionsBar();

    return (
        <div>
            <div className="flex flex-col gap-2">
                {productsFiltered.map(item=> (
                    // Nota: antes era un <button>, pero ImageThumbnail zoomable renderiza su
                    // propio <button> interno para abrir el zoom, y un <button> no puede
                    // contener otro <button> (contenido interactivo anidado, inválido en HTML).
                    // Se reemplaza por un div con role="button" + soporte de teclado para
                    // conservar la semántica y accesibilidad de "tarjeta clicable".
                    <div
                        key={item.productId.toString()}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleViewProduct(item?.productId?.toString() || '')}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                handleViewProduct(item?.productId?.toString() || '');
                            }
                        }}
                        className={clsx('cursor-pointer bg-white rounded-2xl w-full p-2', handleColorRow(item))}
                    >
                        <div className="flex justify-between gap-2">
                            <Badge type="purple" className="transition-all duration-300">{item.category?.name ?? 'No Disponible'}</Badge>
                            {productId===item.productId.toString()
                                ? <Spinner size={14} color="black"/>
                                : '' }
                        </div>
                        <div className="flex gap-2 justify-center">
                            <ImageThumbnail src={item.imageUrl} alt={item.name} size={80} rounded="lg" zoomable />
                        </div>
                        <div className="flex flex-col w-full justify-center items-center">
                            <span className="text-red-600 text-sm">{item.inventory?.internalBarCode}</span>
                            <span className="font-bold text-xl">
                                {item.name}(<span className="text-white bg-blue-500 p-1 rounded-full">{totalStock(item?.inventory?.inventoryItems ?? [])}</span>)
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <Badge size="md">Menudeo</Badge>
                                <span className="text-3xl">{numberMoneyFormat(item.inventory?.salePriceOne ?? 0)}</span>
                            </div>
                            <div className="flex flex-col">
                                <Badge size="md" type="green">Mayoreo</Badge>
                                <span className="text-3xl">{numberMoneyFormat(item.inventory?.salePriceMany ?? 0)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}