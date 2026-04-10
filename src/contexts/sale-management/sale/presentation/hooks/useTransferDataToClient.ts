import { ICustomer } from '@/contexts/sale-management/customer/presentation/interfaces/ICustomer';
import { IPaymentMethod } from '@/contexts/sale-management/payment-method/presentation/interfaces/IPaymentMethod';
import { useEffect } from 'react';
import { useSaleProcessStore } from '../stores/sale.process.store';

interface Props {
    methods: IPaymentMethod[],
    customers: ICustomer[],
}

const useTransferDataToClientNewSale = ({ methods, customers }: Props) => {
    const { setPaymentMethods, paidAmount, setCustomers } = useSaleProcessStore();

    useEffect(()=>{
        setCustomers(customers ?? []);
    },[customers]);

    useEffect(()=>{
        setPaymentMethods(methods);
    },[paidAmount, methods]);

    return {

  }
}

export default useTransferDataToClientNewSale
