import { useEffect } from 'react';
import { useSalePaymentStore } from '../infraestructure/stores/sale.payment.store';
import { PaymentMethodEntity } from '@/features/payment-method/domain/entities/payment-method-entity';

interface Props {
    methods: PaymentMethodEntity[],
}

const useTransferDataToClientNewSale = ({ methods }: Props) => {
    const { setPaymentMethods, paidAmount } = useSalePaymentStore();

    useEffect(()=>{
        setPaymentMethods(methods);
    },[paidAmount]);

    return {

  }
}

export default useTransferDataToClientNewSale
