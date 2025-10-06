import { useEffect } from 'react';
import { PaymentMethodEntity } from '@/features/payment-method/domain/entities/payment-method-entity';
import { useSaleProcessStore } from '../infraestructure/stores/sale.process.store';
import { CustomerEntity } from '@/features/customer/domain/entities/customer.entity';
import { InventoryItemEntity } from '@/features/inventory/domain/entities/inventory-item.entity';

interface Props {
    methods: PaymentMethodEntity[],
    customers: CustomerEntity[],
    inventoryItems: InventoryItemEntity[],
}

const useTransferDataToClientNewSale = ({ methods, customers, inventoryItems }: Props) => {
    const { setPaymentMethods, paidAmount, setCustomers, setInventoryItems } = useSaleProcessStore();

    useEffect(()=>{
        setCustomers(customers ?? []);
        setInventoryItems(inventoryItems ?? []);
    },[]);

    useEffect(()=>{
        setPaymentMethods(methods);
    },[paidAmount]);

    return {

  }
}

export default useTransferDataToClientNewSale
