import { useState } from "react";
import { SaleDetailEntity } from "../domain/entities/sale-detail-entity";
import { SaleEntity } from "../domain/entities/sale-entity";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { physicalDeleteSaleDetailAction } from "../actions/phisical-delete-sale-detail.action";
import { useSale } from "./useSale";

const useDeleteDetail = () => {
    const { 
        openModalDeleteDetail, closeModalDeleteDetail, modalDeleteDetail, detailSelected, setDetailSelected, saleId
    } = useSaleStore();
    const { handleUpdateSaleDetails } = useSale();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    
    const handleOpenModalDeleteDetail = (detail: SaleDetailEntity) => {
        setDetailSelected(detail);
        openModalDeleteDetail();
    }
    const handleCloseModalDeleteDetail = () => {
        closeModalDeleteDetail();
    }

    const handlePhysicalDeleteSaleDetail = async ()=>{
        setIsLoading(true);
        try {
            if(!saleId || !detailSelected?.saleDetailId){
                throw Error('No se ha seleccionado correctamente la informacion necesaria.');
            }
            const result = await physicalDeleteSaleDetailAction(saleId, detailSelected?.saleDetailId);
            if(!result.ok){
                setFloatMessageState({
                    type: 'red',
                    summary: 'No se pudo eliminar el producto.',
                    description: result.error?.message ?? 'No se ha podido completar la acción.',
                    isActive: true,
                });
            } else {
                await handleUpdateSaleDetails(saleId);
                setFloatMessageState({
                    type: 'green',
                    summary: '¡Producto eliminado!',
                    description: 'Se han eliminado los productos de la venta.',
                    isActive: true,
                });
            }
            setIsLoading(false);
            setTimeout(()=> {
                setFloatMessageState({});
                closeModalDeleteDetail();
            }, 2000);
        } catch (error) {
            setIsLoading(false);
            setFloatMessageState({
                type: 'red',
                summary: 'Ha ocurrido un error inesperado',
                description: 'Ocurrió un error al eliminar los productos',
                isActive: true,
            });
            setTimeout(()=> {
                setFloatMessageState({});
            }, 2000);
        }
    }
    return {
        detailSelected,
        modalDeleteDetail,
        handleCloseModalDeleteDetail,
        handleOpenModalDeleteDetail,
        handlePhysicalDeleteSaleDetail,
        isLoading,
        floatMessageState,
    }
}

export { useDeleteDetail };
