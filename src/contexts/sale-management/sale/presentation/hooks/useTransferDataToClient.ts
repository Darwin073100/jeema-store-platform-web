import { IInventoryItem } from '@/contexts/inventory-management/inventory-item/presentation/interfaces/IInventoryItem';
import { ICustomer } from '@/contexts/sale-management/customer/presentation/interfaces/ICustomer';
import { IPaymentMethod } from '@/contexts/sale-management/payment-method/presentation/interfaces/IPaymentMethod';
import { useEffect } from 'react';
import { useSaleProcessStore } from '../stores/sale.process.store';

interface Props {
    methods: IPaymentMethod[],
    customers: ICustomer[],
    inventoryItems: IInventoryItem[],
}

const useTransferDataToClientNewSale = ({ methods, customers, inventoryItems }: Props) => {
    const { setPaymentMethods, paidAmount, setCustomers, setInventoryItems } = useSaleProcessStore();

    useEffect(()=>{
        setCustomers(customers ?? []);
        setInventoryItems(inventoryItems ?? []);
    },[customers, inventoryItems]);

    useEffect(()=>{
        setPaymentMethods(methods);
    },[paidAmount, methods]);

    return {

  }
}

export default useTransferDataToClientNewSale
