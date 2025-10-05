import { useEffect } from 'react';
import { PaymentMethodEntity } from '@/features/payment-method/domain/entities/payment-method-entity';
import { useWorkspace } from '@/shared/hooks/useAuth';
import { findAllCustomerByEstablishmentAction } from '@/features/customer/actions/find-all-customer-by-establishment.action';
import { useSaleProcessStore } from '../infraestructure/stores/sale.process.store';

interface Props {
    methods: PaymentMethodEntity[],
}

const useTransferDataToClientNewSale = ({ methods }: Props) => {
    const { establishment } = useWorkspace();
    const { setPaymentMethods, paidAmount, setCustomers } = useSaleProcessStore();

    useEffect(()=>{
        handleLoadCustomerList();
    },[]);

    // Hace la peticion al servidor para traer los clientes registrados y cargarlos en el estado global.
    const handleLoadCustomerList = async ()=> {
        const establishmentId = BigInt(establishment?.establishmentId ?? 0);
        const result = await findAllCustomerByEstablishmentAction(establishmentId);
        if(result.ok){
           setCustomers(result.value?.customers ?? []); 
        }
    }

    useEffect(()=>{
        setPaymentMethods(methods);
    },[paidAmount]);

    return {

  }
}

export default useTransferDataToClientNewSale
