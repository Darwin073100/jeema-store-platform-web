import { CustomerEntity } from "@/features/customer/domain/entities/customer.entity";
import { useEffect, useState } from "react";
import { useSaleUIStore } from "../infraestructure/stores/sale.ui.store";
import { useSaleProcessStore } from "../infraestructure/stores/sale.process.store";

const useCustomerSale = () => {
    const { setFloatMessageState, saleModals, openSaleModal, closeSaleModal} = useSaleUIStore();
    const { 
        setCustomerSelected, customerSelected, filterCustomers, customers, setFilterCustomers,
    } = useSaleProcessStore();
    const [customerIValue, setCustomerIValue] = useState<string>('');

    // Hook para filtrar los clientes
    useEffect(()=>{
        const regex = new RegExp(customerIValue, 'i');
        const newcustomerByFirstNameFilter = customers.filter( item => regex.test(item.firstName ?? ''));
        const newcustomerByLastNameFilter = customers.filter( item => regex.test(item.lastName ?? ''));
        const completFilter = [...(new Set([...newcustomerByFirstNameFilter, ...newcustomerByLastNameFilter]))]

        setFilterCustomers(completFilter);
    }, [customerIValue]);

    const handleCustomerSelected = (customer: CustomerEntity | null)=>{
        setCustomerSelected(customer);
        setFloatMessageState({
            isActive: true,
            summary: '¡Correcto!',
            description: 'Has cambiado de cliente correctamente',
            type: 'green'
        });
        closeSaleModal();
        setTimeout(()=> {
            setFloatMessageState({});
        }, 2000);
    }

    useEffect(()=>{
        setFilterCustomers(customers);
    },[saleModals]);


    return {
        handleCustomerSelected,
        customerSelected,
        filterCustomers, 
        customers, 
        saleModals,
        openSaleModal,
        closeSaleModal, 
        customerIValue,
        setCustomerIValue,
    }
}

export { useCustomerSale };
