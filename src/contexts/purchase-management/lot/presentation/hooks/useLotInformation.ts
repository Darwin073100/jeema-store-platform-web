import { useLotStore } from "../stores/lot.store";

export const useLotInformation = ()=> {
    const { lotsFiltered } = useLotStore();

    const totalProductsStock = ()=> {
        let total = 0;
        lotsFiltered.forEach(item => {
            total = total + item.initialQuantity
        });
        return total;
    }

    const totalAmountPurchase = ()=> {
        let total = 0;
        lotsFiltered.forEach(item => {
            total = total + (item.initialQuantity*item.purchasePrice);
        });
        return total;
    }

    return {
        totalProductsStock,
        totalAmountPurchase
    }
}