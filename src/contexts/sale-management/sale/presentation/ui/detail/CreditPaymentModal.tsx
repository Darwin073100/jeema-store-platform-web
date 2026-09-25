'use client'
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { FcMoneyTransfer, FcSmartphoneTablet } from 'react-icons/fc';
import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { MdOutlinePaid } from 'react-icons/md';
import { numberBasicFormat, numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useSaleUIStore } from '../../stores/sale.ui.store';
import { useWorkspace } from '@/shared/ui/hooks/auth/useAuth';
import { ISale } from '../../interfaces/ISale';
import { IPaymentMethod } from '@/contexts/sale-management/payment-method/presentation/interfaces/IPaymentMethod';
import { registerCreditPaymentAction } from '@/contexts/sale-management/sale-payment/presentation/actions/register-credit-payment.action';
import { RegisterCreditPaymentItemDTO } from '@/contexts/sale-management/sale-payment/application/dtos/register-credit-payment.dto';
import { findCashSessionByEmployeeIdAction } from '@/contexts/cash-management/cash-session/presentation/actions/find-cash-session-by-employee-id.action';

interface Props {
    sale: ISale;
    paymentMethods: IPaymentMethod[];
}

const CreditPaymentModal = ({ sale, paymentMethods }: Props) => {
    const { saleModals, closeSaleModal, setFloatMessageState } = useSaleUIStore();
    const { employee } = useWorkspace();
    const isOpen = saleModals === 'creditPaymentModal';

    const [cashAmount, setCashAmount] = useState(0);
    const [transferAmount, setTransferAmount] = useState(0);
    const [transferNumberRef, setTransferNumberRef] = useState('');
    const [cashRegisterId, setCashRegisterId] = useState<bigint | null>(null);
    const [loadingCashSession, setLoadingCashSession] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const balanceAmount = sale?.balanceAmount ?? 0;
    const totalToPay = Number(cashAmount) + Number(transferAmount);

    // Al abrir el modal: resetear el formulario y obtener la caja activa del empleado
    // actual (la página de detalle de venta, a diferencia de /sale/new, no la carga por
    // servidor, así que se resuelve aquí de la misma forma que findCashSessionByEmployeeIdAction
    // ya la resuelve en el checkout).
    useEffect(() => {
        if (isOpen) {
            setCashAmount(0);
            setTransferAmount(0);
            setTransferNumberRef('');
            setErrorMessage('');
            setLoadingCashSession(true);
            findCashSessionByEmployeeIdAction()
                .then(result => {
                    setCashRegisterId(result.ok && result.value ? result.value.cashRegisterId : null);
                })
                .finally(() => setLoadingCashSession(false));
        }
    }, [isOpen]);

    const handleClose = () => {
        if (submitting) return;
        closeSaleModal();
    }

    const handleSubmit = async () => {
        setErrorMessage('');

        if (totalToPay <= 0) {
            setErrorMessage('Ingresa un monto mayor a $0.');
            return;
        }
        if (totalToPay > balanceAmount) {
            setErrorMessage('El abono no puede ser mayor al saldo pendiente de la venta.');
            return;
        }
        if (!cashRegisterId) {
            setErrorMessage('Necesitas aperturar caja para continuar.');
            return;
        }

        // Mismo patrón hardcodeado de SalePaymentModal.tsx: solo Efectivo/Transferencia,
        // no se generaliza el selector de métodos de pago (deuda técnica preexistente).
        const cashMethod = paymentMethods.find(item => item.name.toLowerCase() === 'efectivo');
        const transferMethod = paymentMethods.find(item => item.name.toLowerCase() === 'transferencia');

        const payments: RegisterCreditPaymentItemDTO[] = [];
        if (cashAmount > 0 && cashMethod) {
            payments.push({
                paymentMethodId: cashMethod.paymentMethodId,
                amountPaid: cashAmount,
                referenceNumber: null,
            });
        }
        if (transferAmount > 0 && transferMethod) {
            payments.push({
                paymentMethodId: transferMethod.paymentMethodId,
                amountPaid: transferAmount,
                referenceNumber: transferNumberRef !== '' ? transferNumberRef : `REF-TRANSFER-${new Date().getTime()}`,
            });
        }

        if (payments.length === 0) {
            setErrorMessage('Selecciona al menos un método de pago.');
            return;
        }

        setSubmitting(true);
        try {
            const result = await registerCreditPaymentAction({
                saleId: sale.saleId,
                employeeId: BigInt(employee?.employeeId ?? 0),
                cashRegisterId,
                payments,
            });

            if (!result.ok) {
                const message = result.error?.message;
                setErrorMessage(
                    Array.isArray(message) ? message.join(' ') : (message ?? 'Ocurrió un error al registrar el abono.')
                );
                setSubmitting(false);
                return;
            }

            const updatedBalance = result.value.sale.balanceAmount;
            setFloatMessageState({
                isActive: true,
                type: 'green',
                summary: '¡Abono registrado!',
                description: updatedBalance <= 0
                    ? 'La venta quedó completamente liquidada.'
                    : `Saldo pendiente: ${numberMoneyFormat(updatedBalance)}`,
            });
            setSubmitting(false);
            closeSaleModal();
            setTimeout(() => {
                setFloatMessageState({});
            }, 3000);
        } catch (error) {
            setSubmitting(false);
            setErrorMessage('Ocurrió un error inesperado al registrar el abono.');
        }
    }

    return (
        <TemplateModal isOpen={isOpen} size='xl' onClose={handleClose} title='Abonar a crédito'>
            <div className="p-6 space-y-4">
                <div className="flex flex-col justify-center items-center gap-4">
                    <div className="text-center">
                        <span className="text-gray-600 text-md">Saldo pendiente</span>
                        <div className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                            $ {numberBasicFormat(balanceAmount)}
                        </div>
                    </div>
                    <div className='flex gap-2 justify-center'>
                        <div
                            className={clsx(`w-[200px] max-sm:w-full border border-orange-100 rounded-xl p-4 max-sm:p-2 flex gap-1 flex-col items-center justify-center transition-all duration-300`,
                                cashAmount > 0 && `bg-orange-100`
                        )}>
                            <div className='flex justify-center'><FcMoneyTransfer className='w-20 max-sm:w-15 h-20 max-sm:h-15' /></div>
                            <span className='text-gray-600 font-bold'>Efectivo</span>
                            <TextInput
                                autoFocus
                                min={0}
                                value={cashAmount}
                                onChange={(e)=> setCashAmount(Number(e.target.value))}
                                type='number'
                                placeholder='Monto'/>
                        </div>
                        <div
                            className={clsx(`w-[200px] max-sm:w-full border border-orange-100 rounded-xl p-4 max-sm:p-2 flex gap-1 flex-col items-center justify-center transition-all duration-300`,
                                transferAmount > 0 && `bg-orange-100`
                        )}>
                            <div className='flex justify-center'><FcSmartphoneTablet className='w-20 max-sm:w-15 h-20 max-sm:h-15' /></div>
                            <span className='text-gray-600 font-bold'>Transferencia</span>
                            <TextInput
                                min={0}
                                value={transferAmount}
                                onChange={(e)=> setTransferAmount(Number(e.target.value))}
                                type='number'
                                placeholder='Monto'/>
                            <TextInput
                                value={transferNumberRef}
                                onChange={(e)=> setTransferNumberRef(String(e.target.value))}
                                placeholder='Referencia(Opc.)'/>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        <div className='flex gap-2 items-center'>
                            <LabelInput value='Total del abono:' className='w-[160px] text-xl'/>
                            <span className='text-xl font-bold'>$ {numberBasicFormat(totalToPay)}</span>
                        </div>
                        {
                            loadingCashSession &&
                                <p className='text-sm text-gray-500'>Verificando caja activa…</p>
                        }
                        {
                            (!loadingCashSession && !cashRegisterId) &&
                                <p className='text-sm text-red-600'>* Necesitas aperturar caja para continuar.</p>
                        }
                        {
                            errorMessage &&
                                <p className='text-red-500 text-sm'>{`* ${errorMessage}`}</p>
                        }
                    </div>
                </div>
                {/* Botones del formulario */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        onClick={()=> handleSubmit()}
                        type="button"
                        color='orange'
                        className='flex justify-center items-center min-w-[160px]'
                        disabled={submitting || loadingCashSession || !cashRegisterId}
                    >
                        { submitting
                            ? <><Spinner/></>
                            : <MdOutlinePaid className="w-4 h-4" /> }
                        <span>Registrar abono</span>
                    </Button>
                    <Button
                        type="button"
                        color="gray"
                        className="flex items-center"
                        onClick={handleClose}
                        disabled={submitting}
                    >
                        <IoClose className="mr-2 w-4 h-4" />
                        <span>Cerrar</span>
                    </Button>
                </div>
            </div>
        </TemplateModal>
    )
}

export { CreditPaymentModal }
