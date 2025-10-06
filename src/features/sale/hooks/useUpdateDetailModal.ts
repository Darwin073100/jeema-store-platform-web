import { useEffect, useState } from "react";
import { SaleDetailEntity } from "../domain/entities/sale-detail-entity";
import { useSaleUIStore } from "../infraestructure/stores/sale.ui.store";
import { useSaleProcessStore } from "../infraestructure/stores/sale.process.store";
import { CreateSaleAndAddDetailAction } from "../actions/create-sale-and-add-detail.action";
import { useSale } from "./useSale";
import { useSaleStore } from "../infraestructure/stores/sale.store";

type SaleForType = 'Menudeo' | 'Mayoreo' | 'Especial';

const useUpdateDetailModal = () => {
    const {
        saleModals, openSaleModal, closeSaleModal, setFloatMessageState, finishLoading, initLoading, loading
    } = useSaleUIStore();
    const {
        setDetailSelected, detailSelected, itemMatchDetail, setItemMatchDetail, inventoryItems
    } = useSaleProcessStore();
    const { setSale, setSaleId, saleId } = useSaleStore();
    const { hancleCalculateDetailPrice } = useSale()
    const [detailPrice, setDetailPrice] = useState<number>(0);
    const [detailQuantity, setDetailQuantity] = useState<number>(0);
    const [detailCurrentTotal, setDetailCurrentTotal] = useState<number>(0);
    const [saleFor, setSaleFor] = useState<SaleForType>('Menudeo');

    // Metodo para abriri y seleccionar el detalle en la UI
    const handleLoadUpdateDetail = (detail: SaleDetailEntity) => {
        setDetailSelected(detail);
        openSaleModal('updateDetailModal');
        handleSearchItemInfo(detail.inventoryId, detail.productBarCodeAtSale);
    }

    // Buscar el item de inventario
    const handleSearchItemInfo = (inventoryId: bigint, barCode: string) => {
        const itemResult = inventoryItems.find(item =>
            (item.inventory?.isSellable === true) &&
            (item.inventoryId === inventoryId) &&
            ((barCode.trim().toLowerCase() === item?.inventory?.internalBarCode?.trim().toLowerCase()) ||
                (barCode.trim().toLowerCase() === item?.inventory?.product?.universalBarCode?.trim().toLowerCase()))
        );
        setItemMatchDetail(itemResult ?? null);
    }

    // Actualizar el total en la UI
    const currencyDetailTotal = () => {
        setDetailCurrentTotal(detailQuantity * Number(detailPrice));
    }

    // Actualizar el precio del detalle, dependiendo si es mayoreo o menudeo
    const currencyDetailPrice = () => {
        if (saleFor === 'Mayoreo' && itemMatchDetail?.inventory?.salePriceMany) {
            setDetailPrice(itemMatchDetail?.inventory?.salePriceMany);
        } else if (saleFor === 'Menudeo' && itemMatchDetail?.inventory?.salePriceOne) {
            setDetailPrice(itemMatchDetail?.inventory?.salePriceOne);
        }
    }

    useEffect(() => {
        setDetailQuantity(Number(detailSelected?.quantity ?? 0));
        currencyDetailPrice();
    }, [saleModals]);

    useEffect(() => {
        if (itemMatchDetail?.inventory?.saleQuantityMany && detailQuantity >= itemMatchDetail?.inventory?.saleQuantityMany) {
            setSaleFor('Mayoreo');
        } else if (itemMatchDetail?.inventory?.saleQuantityMany && detailQuantity < itemMatchDetail?.inventory?.saleQuantityMany) {
            setSaleFor('Menudeo');
        }
        currencyDetailPrice();
    }, [detailQuantity]);

    useEffect(() => {
        currencyDetailPrice();
    }, [saleFor]);

    useEffect(() => {
        currencyDetailTotal()
    }, [detailPrice, saleFor, detailQuantity]);

    const handleUpdateQuantityDetail = async () => {
        const inventorySelected = itemMatchDetail?.inventory;
        if(inventorySelected){
            const addDetailToSaleDTO = hancleCalculateDetailPrice(inventorySelected, detailQuantity);
            initLoading('updateDetailLoading');
            const result = await CreateSaleAndAddDetailAction(saleId, BigInt(2), addDetailToSaleDTO);
            if (!result.ok) {
                setFloatMessageState({
                    type: 'red',
                    summary: '¡Hay un error!',
                    description: result.error?.message ?? 'Ha ocurrido un error al modificar la cantidad.',
                    isActive: true,
                });
                setTimeout(() => {
                    setFloatMessageState({});
                }, 2000);
            } else {
                // Validar que venga un value para actualizar el estado de la venta.
                result.value ?
                    setSale(result.value) : null;
                result.value ?
                    setSaleId(result.value.saleId) : null;
    
                setFloatMessageState({
                    type: 'green',
                    summary: '¡Correcto!',
                    description: 'Cambios realizados.',
                    isActive: true
                });
                closeSaleModal();
                setTimeout(()=>{
                    setFloatMessageState({});
                }, 3000)
            }
            finishLoading();
        } else {
            setFloatMessageState({
                type: 'red',
                summary: '¡Hay un error!',
                description: 'Ha ocurrido un error al aplicar los cambios.',
                isActive: true,
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 2000);
        }
    }



    return {
        closeSaleModal,
        openSaleModal,
        saleModals,
        handleLoadUpdateDetail,
        detailSelected,
        detailQuantity,
        setDetailQuantity,
        detailCurrentTotal,
        itemMatchDetail,
        detailPrice,
        saleFor,
        loading,
        handleUpdateQuantityDetail,
    }
}

export { useUpdateDetailModal };
