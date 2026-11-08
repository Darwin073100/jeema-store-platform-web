import { useEffect, useState } from "react";
import { CreateSaleAndAddDetailAction } from "../actions/create-sale-and-add-detail.action";
import { physicalDeleteSaleDetailAction } from "../actions/phisical-delete-sale-detail.action";
import { useSale } from "./useSale";
import { SaleForEnum } from "../../domain/enums/sale-for.enum";
import { useSaleUIStore } from "../stores/sale.ui.store";
import { useSaleProcessStore } from "../stores/sale.process.store";
import { useSaleStore } from "../stores/sale.store";
import { AddDetailToSaleDto } from "@/contexts/sale-management/sale-detail/application/dtos/add-detail-to-sale.dto";
import { searchInventoryItemInformationAction } from "@/contexts/inventory-management/inventory-item/presentation/actions/search-inventory-item-information.action";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { ISale } from "../interfaces/ISale";
import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";

/** Cantidad máxima aceptada. Más dígitos suelen ser un código de barras escaneado por error en el input. */
export const MAX_DETAIL_QUANTITY = 99999;

export type SaleDetailModalMode = 'edit' | 'confirmDelete';

/**
 * Lógica del modal único de un producto en la venta (`SaleDetailModal`): cambiar la cantidad, alternar
 * menudeo/mayoreo y eliminarlo. El modal se abre desde la lista con `setDetailSelected` +
 * `openSaleModal('saleDetailModal')`; este hook carga los precios de inventario al abrirse.
 */
const useSaleDetailModal = () => {
    const {
        saleModals, closeSaleModal, setFloatMessageState, finishLoading, initLoading, loading
    } = useSaleUIStore();
    const {
        detailSelected, itemMatchDetail, setItemMatchDetail, setLastTouchedDetail, lastTouchedDetail
    } = useSaleProcessStore();
    const { setSale, setSaleId, saleId, cashSessionActive } = useSaleStore();
    const { hancleCalculateDetailPrice, handleUpdateSaleDetails } = useSale();
    const [detailQuantity, setDetailQuantity] = useState<number>(0);
    const [mode, setMode] = useState<SaleDetailModalMode>('edit');
    const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(false);
    const [pricesError, setPricesError] = useState<boolean>(false);

    const isOpen = saleModals === 'saleDetailModal';

    // Al abrir (o cambiar de producto) se reinicia el formulario durante el render, no en un efecto:
    // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
    const openedDetail = isOpen ? detailSelected : null;
    // Empieza en null para que también se inicialice si el componente se monta con el modal ya abierto.
    const [prevOpenedDetail, setPrevOpenedDetail] = useState<ISaleDetail | null>(null);
    if (openedDetail !== prevOpenedDetail) {
        setPrevOpenedDetail(openedDetail);
        if (openedDetail) {
            setMode('edit');
            setDetailQuantity(Number(openedDetail.quantity));
            setPricesError(false);
            setIsLoadingPrices(true);
        }
    }

    // Busca los precios de inventario sin bloquear la apertura. Quien abre el modal limpia antes
    // `itemMatchDetail`, para no mostrar los precios del producto anterior.
    useEffect(() => {
        if (!isOpen || !detailSelected) return;
        let cancelled = false;
        searchInventoryItemInformationAction(detailSelected.inventoryId, detailSelected.productBarCodeAtSale)
            .then(result => {
                if (cancelled) return;
                setItemMatchDetail(result?.value ?? null);
                setPricesError(!result?.value);
            })
            .catch(() => {
                if (!cancelled) setPricesError(true);
            })
            .finally(() => {
                if (!cancelled) setIsLoadingPrices(false);
            });
        return () => {
            cancelled = true;
        };
    }, [isOpen, detailSelected, setItemMatchDetail]);

    //* Las columnas decimal llegan como string desde Postgres: se normalizan antes de comparar (ver useSale).
    const inventory = itemMatchDetail?.inventory ?? null;
    const salePriceOne = Number(inventory?.salePriceOne ?? 0);
    const salePriceMany = Number(inventory?.salePriceMany ?? 0);
    const saleQuantityMany = Number(inventory?.saleQuantityMany ?? 0);
    const hasManyPrice = Number.isFinite(salePriceMany) && salePriceMany > 0
        && Number.isFinite(saleQuantityMany) && saleQuantityMany > 0;
    const saleFor = hasManyPrice && detailQuantity >= saleQuantityMany ? SaleForEnum.MANY : SaleForEnum.ONE;
    const detailPrice = saleFor === SaleForEnum.MANY ? salePriceMany : salePriceOne;
    const detailTotal = detailQuantity * detailPrice;

    const isQuantityTooLarge = detailQuantity > MAX_DETAIL_QUANTITY;
    const canApply = !!inventory && !isLoadingPrices && detailQuantity > 0 && !isQuantityTooLarge
        && detailQuantity !== Number(detailSelected?.quantity ?? 0);

    const notify = (type: FloatMessageType['type'], summary: string, description: string | string[], ms = 2000) => {
        setFloatMessageState({
            type, summary, isActive: true,
            description: Array.isArray(description) ? description.join(' ') : description,
        });
        setTimeout(() => {
            setFloatMessageState({});
        }, ms);
    };

    const ensureCashSession = () => {
        if (!cashSessionActive) {
            notify('red', '404: ¡Error! 😢', 'Debes aperturar caja para poder continuar', 4000);
            return null;
        }
        return cashSessionActive;
    };

    const handleSaleUpdated = (sale: ISale | null | undefined) => {
        if (sale) {
            setSale(sale);
            setSaleId(sale.saleId);
            setLastTouchedDetail(sale.saleDetails?.find(d => d.saleDetailId === detailSelected?.saleDetailId) ?? null);
        }
        notify('green', '¡Correcto!', 'Cambios realizados.', 3000);
        closeSaleModal();
    };

    /** Aplica la cantidad escrita, recalculando menudeo/mayoreo con las reglas de `useSale`. */
    const applyQuantity = async () => {
        if (!canApply || !inventory) return;
        const cashSession = ensureCashSession();
        if (!cashSession) return;
        const addDetailToSaleDTO = hancleCalculateDetailPrice(inventory, detailQuantity);
        initLoading('updateDetailLoading');
        const result = await CreateSaleAndAddDetailAction(BigInt(1), cashSession.cashRegisterId, addDetailToSaleDTO);
        finishLoading();
        if (!result.ok) {
            notify('red', '¡Hay un error!', result.error?.message ?? 'Ha ocurrido un error al modificar la cantidad.');
            return;
        }
        handleSaleUpdated(result.value);
    };

    /** Cambia manualmente el detalle de menudeo a mayoreo o al revés. */
    const toggleSaleFor = async () => {
        if (!detailSelected) return;
        const cashSession = ensureCashSession();
        if (!cashSession) return;
        if (!hasManyPrice) {
            notify('yellow', '¡Accion no realizada!', 'Este producto no cuenta con precio por mayoreo.');
            return;
        }
        const currentDetail: AddDetailToSaleDto = {
            productBarCodeAtSale: detailSelected.productBarCodeAtSale,
            productUnitAtSale: detailSelected.productUnitAtSale,
            quantity: detailQuantity,
            notes: detailSelected.notes ?? undefined,
            specialPrice: detailSelected.unitPriceAtSale,
            saleFor: detailSelected.saleFor === SaleForEnum.ONE ? SaleForEnum.MANY
                : detailSelected.saleFor === SaleForEnum.MANY ? SaleForEnum.ONE
                : SaleForEnum.SPECIAL,
            saleId,
        };
        initLoading('aplyManualSaleForLoading');
        const result = await CreateSaleAndAddDetailAction(BigInt(1), cashSession.cashRegisterId, currentDetail);
        finishLoading();
        if (!result.ok) {
            notify('red', '¡Hay un error!', result.error?.message ?? 'Ha ocurrido un error al modificar la cantidad.');
            return;
        }
        handleSaleUpdated(result.value);
    };

    /** Elimina el detalle de la venta. Solo se llama desde la confirmación en línea del modal. */
    const deleteDetail = async () => {
        if (!saleId || !detailSelected?.saleDetailId) {
            notify('red', 'Ha ocurrido un error inesperado', 'No se ha seleccionado correctamente la informacion necesaria.');
            return;
        }
        initLoading('deleteDetailLoading');
        try {
            const result = await physicalDeleteSaleDetailAction(saleId, detailSelected.saleDetailId);
            if (!result.ok) {
                notify(
                    'red',
                    `${result.error?.statusCode ?? '500'}: No se pudo eliminar el producto.`,
                    result.error?.message ?? 'No se ha podido completar la acción.',
                );
                return;
            }
            await handleUpdateSaleDetails(saleId);
            if (lastTouchedDetail?.saleDetailId === detailSelected.saleDetailId) {
                setLastTouchedDetail(null);
            }
            notify('green', '¡Producto eliminado!', 'Se han eliminado los productos de la venta.');
            closeSaleModal();
        } catch {
            notify('red', 'Ha ocurrido un error inesperado', 'Ocurrió un error al eliminar los productos');
        } finally {
            finishLoading();
        }
    };

    return {
        isOpen,
        closeSaleModal,
        detailSelected,
        itemMatchDetail,
        detailQuantity,
        setDetailQuantity,
        detailPrice,
        detailTotal,
        saleFor,
        salePriceOne,
        salePriceMany: hasManyPrice ? salePriceMany : null,
        isLoadingPrices,
        pricesError,
        isQuantityTooLarge,
        canApply,
        mode,
        requestDelete: () => setMode('confirmDelete'),
        cancelDelete: () => setMode('edit'),
        loading,
        applyQuantity,
        toggleSaleFor,
        deleteDetail,
    };
};

export { useSaleDetailModal };
