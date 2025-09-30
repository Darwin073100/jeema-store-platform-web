import { CustomerEntity } from "@/features/customer/domain/entities/customer.entity";
import { useSaleCustomerListStore } from "../infraestructure/stores/sale.customer-list.store";
import { useEffect, useState } from "react";
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";

const useCustomerSale = () => {
    const { setCustomerSelected, customerSelected, closeModalCustomerList, filterCustomers, customers, modalCustomerList,
        openModalCustomerList, setFilterCustomers,
     } = useSaleCustomerListStore();
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [customerIValue, setCustomerIValue] = useState<string>('');

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
        closeModalCustomerList();
        setTimeout(()=> {
            setFloatMessageState({});
        }, 2000);
    }

    useEffect(()=>{
        // const defaultCustomer = customers.find(
        //     item=> item.firstName.trim().toLowerCase() === 'Publico'.trim().toLowerCase() 
        //     || item.lastName?.trim().toLowerCase() === 'General'.trim().toLowerCase()
        // );

        // setCustomerSelected(defaultCustomer ?? null);

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
        customerIValue,
        setCustomerIValue
    }
}

export { useCustomerSale };
