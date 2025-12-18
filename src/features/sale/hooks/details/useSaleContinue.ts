'use client'
import { useEffect } from "react";
import { SaleEntity } from "../../domain/entities/sale-entity"
import { useSaleProcessStore } from "../../infraestructure/stores/sale.process.store";
import { useSaleStore } from "../../infraestructure/stores/sale.store";
import { useSaleUIStore } from "../../infraestructure/stores/sale.ui.store"
import { useRouter } from "next/navigation";

interface Props{
    sale: SaleEntity;
}

const useSaleContinue = ({ sale }: Props) => {
    const router = useRouter();
    const { loading, initLoading, finishLoading } = useSaleUIStore();
    const { setCustomerSelected, setPaymentMethods, resetSaleProcessStore } = useSaleProcessStore()
    const { setSale, setSaleId, setTotal, resetSaleStore} = useSaleStore()
    useEffect(()=>{
        finishLoading();
    },[]);
    const handleSaleContinue = ()=>{
        initLoading('saleContinue');
        setSale(sale)
        setSaleId(sale.saleId)
        setTotal(sale.totalAmount)
        if(!!sale?.customer){
            setCustomerSelected(sale.customer)
        }
        router.push('/sale/new');
    }
    
    return {
        handleSaleContinue,
        loading,
    }
}

export { useSaleContinue }
