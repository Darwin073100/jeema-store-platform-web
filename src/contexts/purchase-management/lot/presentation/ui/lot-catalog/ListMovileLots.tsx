'use client'
import { Button } from "@/shared/ui/components/buttons";
import { FiExternalLink } from "react-icons/fi";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { PCol, PrimaryTable, PRow, PTableEmpty } from "@/shared/ui/components/tables/PrimaryTable";
import { useLotStore } from "../../stores/lot.store";
import { useLotActionsBar } from "../../hooks/useLotActionsBar";
import { formatDate, formatDateShort } from "@/shared/lib/utils/date-formatter";
import { numberBasicFormat, numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { FcCopyright, FcSoundRecordingCopyright } from "react-icons/fc";
import clsx from "clsx";

interface ListMovileLotsProps {
}

export function ListMovileLots({ }: ListMovileLotsProps) {
    const { lotsFiltered } = useLotStore();
    const { handleViewProduct, productId } = useLotActionsBar();
    const head = ['FOLIO', 'PRODUCTO', 'PRECIO', 'UNIDAD', 'CANTIDAD', 'TOTAL', 'PROVEEDOR', 'FECHA'];

    return (
        <div>
            <div className="flex flex-col gap-2">
                {lotsFiltered.map(item => (
                    <button key={item.productId.toString()} onClick={() => handleViewProduct(item?.productId?.toString() || '')} className={clsx('bg-white rounded-2xl w-full p-2')}>
                        <div className="flex justify-between gap-2">
                            <div className="flex gap-2 items-center">
                                <Badge type="purple" className="transition-all duration-300">{item.purchaseUnit?? 'No Disponible'}</Badge>
                                <Badge type="yellow" className="transition-all duration-300">{formatDate(item.receivedDate)}</Badge>
                            </div>
                            {productId === item.productId.toString()
                                ? <Spinner size={14} color="black" />
                                : ''}
                        </div>
                        <div className="flex gap-2 justify-center">
                            <FcCopyright size={50} />
                        </div>
                        <div className="flex flex-col w-full justify-center items-center">
                            <span className="text-sm">{item.product?.universalBarCode}</span>
                            <span className="text-red-600 text-sm">{item.suplier?.name}</span>
                            <span className="font-bold text-xl">
                                {item?.product?.name}(<span className="text-white bg-blue-500 p-1 rounded-full">{numberBasicFormat(item.initialQuantity)}</span>)
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <Badge size="md">Costo</Badge>
                                <span className="text-2xl">{numberMoneyFormat(item.purchasePrice ?? 0)}</span>
                            </div>
                            <div className="flex flex-col">
                                <Badge size="md" type="green">Total</Badge>
                                <span className="text-2xl">{numberMoneyFormat(item.initialQuantity*item.purchasePrice)}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}