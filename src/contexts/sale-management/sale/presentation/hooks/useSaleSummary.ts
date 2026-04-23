import { useEffect, useMemo } from "react";
import { useSaleStore } from "../stores/sale.store";
import { useSaleProcessStore } from "../stores/sale.process.store";

const useSaleSummary = () => {
    const { 
        sale, total, setTotal
    } = useSaleStore();
    const { productQuantity, setProductQuantity } = useSaleProcessStore();

    // Memoizar los detalles de la venta para evitar recrearlos
    const saleDetailsLength = useMemo(() => sale?.saleDetails?.length ?? 0, [sale?.saleDetails?.length]);

    useEffect(() => {
        if (sale?.saleDetails && sale.saleDetails.length > 0) {
            // Calcular el total de la venta
            const newTotal = sale.saleDetails.reduce((sum, item) =>
                sum + (Number(item.subtotalItem) || 0), 0);

            // Calcular la cantidad total de productos
            const newQuantity = sale.saleDetails.reduce((sum, item) =>
                sum + (Number(item.quantity) || 0), 0);

            // Actualizar los estados solo si han cambiado
            if (total !== Number(newTotal.toFixed(2))) {
                setTotal(Number(newTotal.toFixed(2)));
            }
            if (productQuantity !== Number(newQuantity.toFixed(2))) {
                setProductQuantity(Number(newQuantity.toFixed(2)));
            }
        } else {
            // Resetear valores si no hay detalles
            if (total !== 0.00) setTotal(0.00);
            if (productQuantity !== 0.00) setProductQuantity(0.00);
        }
    }, [saleDetailsLength, sale?.saleDetails, total, productQuantity, setTotal, setProductQuantity]);

    return {
        total,
        productQuantity
    }
}

export { useSaleSummary }
