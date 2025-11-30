'use client'
import React from 'react'
import { SaleStatusEnum } from '../../domain/enums/sale-status.enum';
import { Button } from '@/ui/components/buttons';
import { SaleEntity } from '../../domain/entities/sale-entity';
import { Badge } from '@/ui/components/badges/Badge';
import { usePayment } from '../../hooks/details/usePayment';
import { FloatMessage } from '@/ui/components/messages';
import { useSaleUIStore } from '../../infraestructure/stores/sale.ui.store';
import { SalePaymentDetailModal } from './SalePaymentModal';
import { PaymentMethodEntity } from '@/features/payment-method/domain/entities/payment-method-entity';
import { IoBagHandle, IoPrintSharp, IoWalletSharp } from 'react-icons/io5';
import { useSaleContinue } from '../../hooks/details/useSaleContinue';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { SaleTicketModal } from '../SaleTicketModal';

interface Props {
    sale: SaleEntity;
    paymentMethods: PaymentMethodEntity[];
}

const HeaderDetail = ({ sale, paymentMethods }: Props) => {
    const { openSaleModal } = usePayment({sale, paymentMethods});
    const { handleSaleContinue, loading} = useSaleContinue({sale});
    const { floatMessageState } = useSaleUIStore();
    return (
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
            <div className="w-full flex items-center justify-between">
                {/* Botones de acción */}
                <div className='flex gap-4 items-center'>
                    {
                        sale.status === SaleStatusEnum.COMPLETED &&
                            <Button onClick={()=> openSaleModal('saleTicketReprintModal')}>
                                <IoPrintSharp />
                                Reimprimir ticket de la venta
                            </Button>
                    }
                    {
                        (sale.status == SaleStatusEnum.PENDING || sale.status == SaleStatusEnum.INITIALIZED) && 
                        <>
                            <Button color="green" onClick={()=> handleSaleContinue()} disabled={loading==='saleContinue'}>
                                {loading==='saleContinue'? <Spinner/>: <IoBagHandle />}
                                Reanudar venta
                            </Button>
                            {
                                sale.status === SaleStatusEnum.PENDING &&<>
                                    <Button color="yellow" onClick={()=> openSaleModal('paymentModal')}>
                                        <IoWalletSharp />
                                        Pagar venta
                                    </Button>
                                </>
                            }
                        </>
                    }
                </div>
                <Badge 
                    type={
                        sale.status === SaleStatusEnum.COMPLETED 
                            ? 'green' : sale.status === SaleStatusEnum.CANCELLED 
                            ? 'red' : sale.status === SaleStatusEnum.PENDING 
                            ? 'blue' : sale.status === SaleStatusEnum.INITIALIZED
                            ? 'yellow' : 'red'
                    } 
                    size='xl'>
                    {sale.status}
                </Badge>
            </div>
            <SalePaymentDetailModal />
            <SaleTicketModal saleId={sale?.saleId ?? BigInt(0)} />
            <FloatMessage 
                {...floatMessageState} />
        </div>
    )
}

export { HeaderDetail };
