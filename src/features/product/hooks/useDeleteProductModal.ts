import { useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { useDeleteProductStore } from "../infraestructure/stores/delete-product.store";
import { deleteProductAction } from "@/contexts/product-management/product/presentation/actions/delete-product.action";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";

const useDeleteProductModal = () => {
    const { handleTrueDeleteOpenModal, handleFalseDeleteOpenModal, deleteOpenModal,
        product, setProduct
    } = useDeleteProductStore();
    
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ floatMessageState, setFloatMessageState ] = useState<FloatMessageType>({});

    const handleOpenModalDeleteProduct = (product: IProduct)=> {
        setProduct(product);
        handleTrueDeleteOpenModal();
    }

    const onSubmit = async () => {
        setFloatMessageState({});
        setIsLoading(true);

        try {
            // Evita que la peticion llegue hasta el servidor si uno de los dos id es nulo
            if( !product) throw new Error('Ha ocurrido un error en el proceso.');
            
            const result = await deleteProductAction(product.productId);
            
            if (result.ok) {
                setFloatMessageState({
                    summary: '¡Eliminado!',
                    isActive: true,
                    type: 'green',
                    description: '¡Producto eliminada :( !'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handleFalseDeleteOpenModal();
                }, 3000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al eliminar e producto';
                
                setFloatMessageState({
                    description: errorMessage,
                    summary: '¡Error!',
                    isActive: true,
                    type: 'red'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                }, 4000);
            }
        } catch(error){
            setFloatMessageState({
                description: 'Error inesperado al eliminar el producto',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            });

            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        handleFalseDeleteOpenModal,
        handleOpenModalDeleteProduct,
        deleteOpenModal,
        onSubmit,
        // UI states
        floatMessageState,
        isLoading,
        product
    }
}

export { useDeleteProductModal };
