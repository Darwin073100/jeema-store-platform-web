import { CustomerEntity } from "@/features/customer/domain/entities/customer.entity";
import { useSaleCustomerListStore } from "../infraestructure/stores/sale.customer-list.store";
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";

const useCustomerSale = () => {
    const { setCustomerSelected, customerSelected, closeModalCustomerList, filterCustomers, customers, modalCustomerList,
        openModalCustomerList, 
     } = useSaleCustomerListStore();
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});

    const handleCustomerSelected = (customer: CustomerEntity | null)=>{
        setFloatMessageState({
            isActive: true,
            summary: '¡Correcto!',
            description: 'Has cambiado de cliente correctamente',
            type: 'green'
        });
        setCustomerSelected(customer);
        closeModalCustomerList();
        setTimeout(()=> {
            setFloatMessageState({});
        }, 2000);
    }

    useEffect(()=>{
        const defaultCustomer = customers.find(
            item=> item.firstName.trim().toLowerCase() === 'Publico'.trim().toLowerCase() 
            || item.lastName?.trim().toLowerCase() === 'General'.trim().toLowerCase()
        );

        setCustomerSelected(defaultCustomer ?? null);

    }, []);

    return {
        handleCustomerSelected,
        customerSelected,
        floatMessageState,
        closeModalCustomerList, 
        filterCustomers, 
        customers, 
        modalCustomerList,
        openModalCustomerList,
    }
}

export { useCustomerSale };
