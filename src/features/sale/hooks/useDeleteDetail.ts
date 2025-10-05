import { SaleDetailEntity } from "../domain/entities/sale-detail-entity";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { physicalDeleteSaleDetailAction } from "../actions/phisical-delete-sale-detail.action";
import { useSale } from "./useSale";
import { useSaleUIStore } from "../infraestructure/stores/sale.ui.store";

const useDeleteDetail = () => {
    const { 
        setFloatMessageState, saleModals, openSaleModal, closeSaleModal, initLoading, finishLoading,
        loading,
    } = useSaleUIStore();
    const { 
        detailSelected, setDetailSelected, saleId
    } = useSaleStore();
    const { handleUpdateSaleDetails } = useSale();
    
    const handleOpenModalDeleteDetail = (detail: SaleDetailEntity) => {
        setDetailSelected(detail);
        openSaleModal('deleteDetailModal');
    }

    const handlePhysicalDeleteSaleDetail = async ()=>{
        initLoading('deleteDetailLoading');
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
            finishLoading();
            setTimeout(()=> {
                setFloatMessageState({});
                closeSaleModal();
            }, 2000);
        } catch (error) {
            finishLoading();
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
        saleModals,
        closeSaleModal,
        handleOpenModalDeleteDetail,
        handlePhysicalDeleteSaleDetail,
        loading,
    }
}

export { useDeleteDetail };
