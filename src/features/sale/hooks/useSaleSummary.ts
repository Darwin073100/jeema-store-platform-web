import { useEffect, useState } from "react";
import { useSaleStore } from "../infraestructure/stores/sale.store";

const useSaleSummary = () => {
    const { 
        sale, total, setTotal, productQuantity, setProductQuantity,
    } = useSaleStore();

    useEffect(() => {
        if (sale?.saleDetails) {
            // Calcular el total de la venta
            const newTotal = sale.saleDetails.reduce((sum, item) =>
                sum + (Number(item.subtotalItem) || 0), 0);

            // Calcular la cantidad total de productos
            const newQuantity = sale.saleDetails.reduce((sum, item) =>
                sum + (Number(item.quantity) || 0), 0);

            // Actualizar los estados
            setTotal(Number(newTotal.toFixed(2))); // Redondear a 2 decimales
            setProductQuantity(Number(newQuantity.toFixed(2)));
        } else {
            // Resetear valores si no hay detalles
            setTotal(0.00);
            setProductQuantity(0.00);
        }
    }, [sale?.saleDetails]); // Dependencia más específica

    return {
        total,
        productQuantity
    }
}

export { useSaleSummary }
