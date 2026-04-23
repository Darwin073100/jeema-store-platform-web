import { ICustomer } from '@/contexts/sale-management/customer/presentation/interfaces/ICustomer';
import { IPaymentMethod } from '@/contexts/sale-management/payment-method/presentation/interfaces/IPaymentMethod';
import { useEffect, useMemo } from 'react';
import { useSaleProcessStore } from '../stores/sale.process.store';

interface Props {
    methods: IPaymentMethod[],
    customers: ICustomer[],
}

const useTransferDataToClientNewSale = ({ methods, customers }: Props) => {
    const { setPaymentMethods, setCustomers } = useSaleProcessStore();

    // Memoizar métodos para evitar recrearlos en cada render
    const memoizedMethods = useMemo(() => methods, [methods]);
    const memoizedCustomers = useMemo(() => customers ?? [], [customers]);

    useEffect(()=>{
        setCustomers(memoizedCustomers);
    },[memoizedCustomers, setCustomers]);

    useEffect(()=>{
        setPaymentMethods(memoizedMethods);
    },[memoizedMethods, setPaymentMethods]);

    return {}
}

export default useTransferDataToClientNewSale
