import clsx from 'clsx';
import React from 'react';
import { useSalePayment } from '../hooks/useSalePayment'
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { FcMoneyTransfer, FcSmartphoneTablet } from 'react-icons/fc';
import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { MdOutlinePaid } from 'react-icons/md';
import { numberBasicFormat } from '@/shared/lib/utils/number-formatter';
import { useSaleStore } from '../infraestructure/stores/sale.store';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useSaleProcessStore } from '../infraestructure/stores/sale.process.store';

const SalePaymentModal = () => {
  const { total } = useSaleStore();
  const { 
    cashAmount, customerChange, paidAmount, setCashAmount, setPaidAmount,
    transferAmount, setTransferAmount, transferNumberRef, setTransferNumberRef
  } = useSaleProcessStore();
  const { handleFinishSale, loading, handlePaidSale, paidAmountMessage, saleModals, closeSaleModal } = useSalePayment();

  return (
    <TemplateModal isOpen={saleModals==='paymentModal'} onClose={closeSaleModal} title='Cobro de la venta'>
      <div className="p-6 space-y-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="text-center">
              <span className="text-gray-600 text-md">Total a pagar</span>
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  $ {numberBasicFormat(total)}
              </div>
          </div>
          <div className='flex gap-2 justify-center'>
            <div
              className={clsx(`w-[200px] max-sm:w-full border border-blue-100 rounded-xl p-4 max-sm:p-2 flex gap-1 flex-col items-center justify-center transition-all duration-300`,
                cashAmount > 0 && `bg-blue-100`
            )}>
              <div className='flex justify-center'><FcMoneyTransfer className='w-20 max-sm:w-15 h-20 max-sm:h-15' /></div>
              <span className='text-gray-600 font-bold'>Efectivo</span>
              <TextInput 
                onChange={(e)=> setCashAmount(Number(e.target.value))}
                value={cashAmount}
                type='number'
                placeholder='Monto'/>
            </div>
            <div
              className={clsx(`w-[200px] max-sm:w-full border border-blue-100 rounded-xl p-4 max-sm:p-2 flex gap-1 flex-col items-center justify-center transition-all duration-300`,
                transferAmount > 0 && `bg-blue-100`
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
              <LabelInput value='Pago con:' className='w-[135px] text-2xl' description='Introduce el monto con el que el cliente esta paganto la venta, para mostrar el cambio que debes devolver.'/>
              <div>
                <TextInput
                  disabled={true}
                  className='flex flex-col'
                  error={paidAmountMessage.isError}
                  errorMessage={paidAmountMessage.message}
                  min={0}
                  value={paidAmount}
                  onChange={(e)=> setPaidAmount(Number(e.target.value))}
                  type='number'
                  placeholder='Introduce el monto'/>
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              <LabelInput value='Cambio:' className='w-[135px] text-2xl' description='Introduce el monto con el que el cliente esta paganto la venta, para mostrar el cambio que debes devolver.'/>
              <span className=' text-xl'>$ {numberBasicFormat(customerChange)}</span>
            </div>
          </div>
        </div>
        {/* Botones del formulario */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            onClick={()=> handleFinishSale()}
            type="button"
            color='yellow'
            className='flex justify-center items-center min-w-[120px]'
            // disabled={isLoading}
          >
            { loading === 'finishSaleLoading'
              ? <><Spinner/></>
              : <> <MdOutlinePaid className="w-4 h-4" /><span className='max-sm:hidden'>{`Posponer cobro`}</span></> 
            }
          </Button>
          <Button
            onClick={()=> handlePaidSale()}
            type="submit"
            className='flex justify-center items-center min-w-[120px]'
            disabled={false}
          >
            { loading === 'salePaymentLoading'
              ? <><Spinner/></>
              : <> <MdOutlinePaid className="w-4 h-4" /><span className='max-sm:hidden'>{`Cobrar venta`}</span></> 
            }
          </Button>
          <Button
            type="button"
            color="gray"
            className="flex items-center"
            onClick={closeSaleModal}
          >
            <IoClose className="mr-2 w-4 h-4" />
            <span className='max-sm:hidden'>{`Cerrar`}</span>
          </Button>
        </div>
      </div>
    </TemplateModal>
  )
}

export { SalePaymentModal }
