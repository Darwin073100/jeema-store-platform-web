'use client'
import React from 'react'
import { IPaymentMethod } from '@/contexts/sale-management/payment-method/presentation/interfaces/IPaymentMethod';
import { SaleStatusEnum } from '../../../domain/enums/sale-status.enum';
import { Button } from '@/shared/ui/components/buttons';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { usePayment } from '../../hooks/details/usePayment';
import { FloatMessage } from '@/shared/ui/components/messages';
import { useSaleUIStore } from '../../stores/sale.ui.store';
import { SalePaymentDetailModal } from './SalePaymentModal';
import { IoBagHandle, IoPrintSharp, IoWalletSharp } from 'react-icons/io5';
import { useSaleContinue } from '../../hooks/details/useSaleContinue';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { SaleReprintTicketModal } from '../SaleReprintTicketModal';
import { ISale } from '../../interfaces/ISale';

interface Props {
    sale: ISale;
    paymentMethods: IPaymentMethod[];
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
                        (sale.status === SaleStatusEnum.COMPLETED || sale.status === SaleStatusEnum.PENDING) &&
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
                            {/* {
                                sale.status === SaleStatusEnum.PENDING &&<>
                                    <Button color="yellow" onClick={()=> openSaleModal('paymentModal')}>
                                        <IoWalletSharp />
                                        Pagar venta
                                    </Button>
                                </>
                            } */}
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
            <SaleReprintTicketModal saleId={sale?.saleId ?? BigInt(0)} />
            <FloatMessage 
                {...floatMessageState} />
        </div>
    )
}

export { HeaderDetail };
