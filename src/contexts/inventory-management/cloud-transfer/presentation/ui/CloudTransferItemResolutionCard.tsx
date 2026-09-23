'use client'
import { useState } from "react";
import { InfoCard } from "@/shared/ui/components/cards";
import { Button } from "@/shared/ui/components/buttons";
import { TextArea } from "@/shared/ui/components/inputs/TextInput copy";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import {
    TbBarcode, TbCategory, TbTag, TbRuler, TbBuildingWarehouse, TbCalendar,
    TbCurrencyDollar, TbBoxMultiple, TbSearch, TbPlus, TbX, TbBarrierBlock,
} from "react-icons/tb";
import { HiOutlineExclamation } from "react-icons/hi";
import { useCloudTransferItemResolution } from "../hooks/useCloudTransferItemResolution";
import { useCloudTransferUIStore } from "../stores/cloud-transfer-ui.store";
import { ProductRelinkSearchModal } from "./ProductRelinkSearchModal";
import { CategoryMappingModal } from "./CategoryMappingModal";
import { ResolutionStatusBadge } from "./ResolutionStatusBadge";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { ICloudTransferItem } from "../interfaces/ICloudTransferItem";
import { CloudTransferItemResolutionStatusEnum } from "../../domain/enums/cloud-transfer-item-resolution-status.enum";
import { formatDateShort } from "@/shared/lib/utils/date-formatter";

interface Props {
    item: ICloudTransferItem;
    onResolved: () => void;
}

/**
 * La pieza central de esta UI (ver spect/09_..._spect.md): tabla comparativa lado-a-lado para UNA línea de
 * traspaso. Izquierda = snapshot exacto que mandó la sucursal origen (inmutable, ya viajó por la nube).
 * Derecha = qué encontró/decidió esta sucursal:
 *  - `Pending` sin auto-match: se explica *por qué* no hubo match (código de barras no encontrado en este
 *    catálogo, o el item no traía código de barras) y se ofrecen las 2 salidas humanas (buscar y vincular,
 *    o declarar producto nuevo) + rechazar la línea.
 *  - `Matched`: se distingue con una badge si fue auto-match por barcode (hecho por
 *    `StartProcessingCloudTransferUseCase` en el servidor) o vinculación manual (para que el usuario sepa
 *    si debe revisar la suposición del sistema o si él mismo la hizo).
 *  - `NewProduct`: mismo tratamiento, mostrando el producto recién creado en el catálogo local.
 *  - `Rejected`: se muestra en gris con el motivo, de solo lectura (no hay "deshacer" en v1).
 */
const CloudTransferItemResolutionCard = ({ item, onResolved }: Props) => {
    const {
        matchedProduct, loadingMatchedProduct,
        relinkSearchText, setRelinkSearchText, relinkResults, relinkSearching,
        handleRelinkSearch, handleRelinkScanned, handleResolveAsExistingProduct,
        handleResolveAsNewProduct, handleReject,
    } = useCloudTransferItemResolution(item, onResolved);
    const { resolutionModal, resolutionItemId, openResolutionModal, closeResolutionModal, cloudTransferLoading } = useCloudTransferUIStore();

    const [rejectReason, setRejectReason] = useState('');
    const [showRejectBox, setShowRejectBox] = useState(false);

    const isThisItem = resolutionItemId === item.cloudTransferItemId;
    const relinkOpen = isThisItem && resolutionModal === 'relink';
    const categoryOpen = isThisItem && resolutionModal === 'category';
    const resolving = cloudTransferLoading === 'resolving-item';
    const isPending = item.resolutionStatus === CloudTransferItemResolutionStatusEnum.PENDING;
    const isRejected = item.resolutionStatus === CloudTransferItemResolutionStatusEnum.REJECTED;

    return (
        <div className={`rounded-2xl shadow border p-5 flex flex-col gap-4 ${isRejected ? 'bg-gray-50 border-gray-300 opacity-75' : 'bg-white border-gray-200'}`}>
            <div className="flex max-md:flex-col md:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0">
                        {item.lineNumber}
                    </span>
                    <h3 className="font-bold text-gray-800 text-lg">{item.productName}</h3>
                </div>
                <div className="flex items-center gap-2">
                    {item.resolutionStatus !== CloudTransferItemResolutionStatusEnum.PENDING && item.autoMatchedByBarcode && (
                        <Badge type="blue">Auto-emparejado por código de barras</Badge>
                    )}
                    {item.resolutionStatus === CloudTransferItemResolutionStatusEnum.MATCHED && !item.autoMatchedByBarcode && (
                        <Badge type="purple">Vinculado manualmente</Badge>
                    )}
                    <ResolutionStatusBadge status={item.resolutionStatus} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* --- Columna izquierda: snapshot que llegó de la sucursal origen (inmutable) --- */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Lo que envió la sucursal origen</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <InfoCard label="Código de barras" value={item.productUniversalBarCode ?? 'Sin código'} icon={<TbBarcode />} />
                        <InfoCard label="Categoría (origen)" value={item.productCategoryName} icon={<TbCategory />} />
                        <InfoCard label="Marca (origen)" value={item.productBrandName ?? 'N/A'} icon={<TbTag />} />
                        <InfoCard label="Unidad de medida" value={item.productUnitOfMeasure} icon={<TbRuler />} />
                        <InfoCard label="Lote" value={item.lotNumber} icon={<TbBuildingWarehouse />} />
                        <InfoCard label="Cantidad transferida" value={`${item.lotTransferredQuantity} ${item.productUnitOfMeasure}`} icon={<TbBoxMultiple />} />
                        <InfoCard label="Precio de compra (origen)" value={`$${item.lotPurchasePrice}`} icon={<TbCurrencyDollar />} />
                        <InfoCard label="Proveedor (informativo)" value={item.lotSupplierName ?? 'N/A'} icon={<TbBuildingWarehouse />} />
                        <InfoCard label="Caducidad" value={item.lotExpirationDate ? formatDateShort(item.lotExpirationDate) : 'N/A'} icon={<TbCalendar />} />
                        <InfoCard label="Fabricación" value={item.lotManufacturingDate ? formatDateShort(item.lotManufacturingDate) : 'N/A'} icon={<TbCalendar />} />
                    </div>
                </div>

                {/* --- Columna derecha: qué encontró/decidió esta sucursal --- */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Lo que hay en tu catálogo</h4>

                    {isPending && (
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-3 text-sm">
                                <HiOutlineExclamation className="w-5 h-5 flex-shrink-0" />
                                <span>
                                    No se encontró ningún producto local con este código de barras
                                    {item.productUniversalBarCode ? ' (puede que el código haya cambiado entre sucursales)' : ' (este item no trae código de barras)'}.
                                    Busca el producto manualmente o decláralo como producto nuevo.
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button type="button" color="green" onClick={() => openResolutionModal('relink', item.cloudTransferItemId)}>
                                    <TbSearch className="w-4 h-4" /> Buscar y vincular producto existente
                                </Button>
                                <Button type="button" color="purple" onClick={() => openResolutionModal('category', item.cloudTransferItemId)}>
                                    <TbPlus className="w-4 h-4" /> Es un producto nuevo
                                </Button>
                                <Button type="button" color="red" size="sm" onClick={() => setShowRejectBox(v => !v)}>
                                    <TbX className="w-4 h-4" /> Rechazar línea
                                </Button>
                            </div>
                            {showRejectBox && (
                                <div className="flex flex-col gap-2 border border-red-200 rounded-xl p-3">
                                    <TextArea
                                        aria-label="Motivo de rechazo"
                                        placeholder="Motivo del rechazo (ej. mercancía dañada, no corresponde a este pedido)..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)} />
                                    <Button
                                        type="button"
                                        color="red"
                                        size="sm"
                                        className="self-end"
                                        disabled={!rejectReason.trim() || resolving}
                                        onClick={() => handleReject(rejectReason.trim())}>
                                        {resolving ? <Spinner /> : <TbBarrierBlock className="w-4 h-4" />}
                                        Confirmar rechazo
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {!isPending && !isRejected && (
                        loadingMatchedProduct ? <Spinner color="blue" /> : matchedProduct ? (
                            <div className="grid grid-cols-2 gap-2">
                                <InfoCard label="Producto local" value={matchedProduct.name} icon={<TbTag />} />
                                <InfoCard label="Código de barras (local)" value={matchedProduct.universalBarCode ?? 'Sin código'} icon={<TbBarcode />} />
                                <InfoCard label="Categoría local" value={matchedProduct.category?.name ?? 'N/A'} icon={<TbCategory />} />
                                <InfoCard label="Marca local" value={matchedProduct.brand?.name ?? 'N/A'} icon={<TbTag />} />
                                <InfoCard label="Stock actual (sucursal)" value={(matchedProduct.inventory?.inventoryItems ?? []).reduce((sum, i) => sum + i.quantityOnHan, 0).toString()} icon={<TbBoxMultiple />} />
                                <InfoCard label="Precio de venta (menudeo)" value={matchedProduct.inventory?.salePriceOne != null ? `$${matchedProduct.inventory.salePriceOne}` : 'N/A'} icon={<TbCurrencyDollar />} />
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No se pudo cargar el detalle del producto vinculado.</p>
                        )
                    )}

                    {isRejected && (
                        <div className="bg-gray-100 border border-gray-300 text-gray-700 rounded-xl p-3 text-sm">
                            <strong>Línea rechazada.</strong> Motivo: {item.rejectionReason || 'Sin motivo especificado.'}
                        </div>
                    )}
                </div>
            </div>

            <ProductRelinkSearchModal
                isOpen={relinkOpen}
                onClose={closeResolutionModal}
                searchText={relinkSearchText}
                setSearchText={setRelinkSearchText}
                results={relinkResults}
                searching={relinkSearching}
                onSearch={handleRelinkSearch}
                onScanned={handleRelinkScanned}
                onSelect={(productId) => { handleResolveAsExistingProduct(productId); closeResolutionModal(); }} />

            <CategoryMappingModal
                isOpen={categoryOpen}
                onClose={closeResolutionModal}
                incomingCategoryName={item.productCategoryName}
                incomingCategoryDescription={item.productCategoryDescription}
                submitting={resolving}
                onSubmit={(dto) => { handleResolveAsNewProduct(dto); closeResolutionModal(); }} />
        </div>
    );
};

export { CloudTransferItemResolutionCard };
