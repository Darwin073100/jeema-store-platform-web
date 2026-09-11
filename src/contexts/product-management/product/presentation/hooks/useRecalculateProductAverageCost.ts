import { useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { recalculateProductAverageCostAction } from "../actions/recalculate-product-average-cost.action";
import { useProductStore } from "../stores/product.store";

const useRecalculateProductAverageCost = () => {
    const { product, setProduct } = useProductStore();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});

    const onRecalculate = async () => {
        if (!product) return;

        setFloatMessageState({});
        setIsLoading(true);

        try {
            const result = await recalculateProductAverageCostAction(product.productId);

            if (result.ok && result.value) {
                setProduct({ ...product, averageCost: result.value.averageCost });

                setFloatMessageState({
                    summary: '¡Recalculado!',
                    isActive: true,
                    type: 'green',
                    description: 'El costo promedio del producto fue recalculado.'
                });
            } else {
                const errorMessage = Array.isArray(result?.error)
                    ? result.error.join(', ')
                    : result?.error?.message || 'Error al recalcular el costo promedio.';

                setFloatMessageState({
                    description: errorMessage,
                    summary: '¡Error!',
                    isActive: true,
                    type: 'red'
                });
            }
        } catch (error) {
            setFloatMessageState({
                description: 'Error inesperado al recalcular el costo promedio.',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        }
    }

    return {
        onRecalculate,
        isLoading,
        floatMessageState,
    }
}

export { useRecalculateProductAverageCost };
