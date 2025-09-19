import React from 'react'
import { useSalePayment } from '../hooks/useSalePayment'
import { Button } from '@/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/ui/components/modals/TemplateModal';
import { FcMoneyTransfer, FcSmartphoneTablet } from 'react-icons/fc';
import { TextInput } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import { MdOutlinePaid, MdPaid } from 'react-icons/md';
import { numberBasicFormat } from '@/shared/lib/utils/number-formatter';

const SalePaymentModal = () => {
  const { 
    closePaymentModal, paymentModal, cashAmount, custumerChange, paidAmount, total, setCashAmount, setPaidAmount
  } = useSalePayment();

  return (
    <TemplateModal isOpen={paymentModal} onClose={closePaymentModal} title='Cobro de la venta'>
      <div className="p-6 space-y-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="text-center">
              <span className="text-gray-600 text-md">Total a pagar</span>
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  $ {numberBasicFormat(total)}
              </div>
          </div>
          <div className='flex gap-2 justify-center'>
            <button type='button' className='hover:bg-blue-100 w-[200px] cursor-pointer border border-blue-100 rounded-xl p-4 flex gap-1 flex-col items-center justify-center transition-all duration-300'>
              <div className='flex justify-center'><FcMoneyTransfer className='w-20 h-20' /></div>
              <span className='text-gray-600 font-bold'>Efectivo</span>
              <TextInput 
              onChange={(e)=> setCashAmount(Number(e.target.value))}
              value={cashAmount}
                type='number'
                placeholder='Monto'/>
            </button>
            <button type='button' className='hover:bg-blue-100 w-[200px] cursor-pointer border border-blue-100 rounded-xl p-4 flex gap-1 flex-col items-center justify-center transition-all duration-300'>
              <div className='flex justify-center'><FcSmartphoneTablet className='w-20 h-20' /></div>
              <span className='text-gray-600 font-bold'>Transferencia</span>
              <TextInput
                type='number'
                placeholder='Monto'/>
              <TextInput
                placeholder='Referencia'/>
            </button>
          </div>
          <div className='w-full flex flex-col gap-2'>
            <div className='flex gap-2 items-center'>
              <LabelInput value='Pago con:' className='w-[135px] text-2xl' description='Introduce el monto con el que el cliente esta paganto la venta, para mostrar el cambio que debes devolver.'/>
              <TextInput
                value={paidAmount}
                onChange={(e)=> setPaidAmount(Number(e.target.value))}
                type='number'
                placeholder='Introduce el monto'/>
            </div>
            <div className='flex gap-2 items-center'>
              <LabelInput value='Cambio:' className='w-[135px] text-2xl' description='Introduce el monto con el que el cliente esta paganto la venta, para mostrar el cambio que debes devolver.'/>
              <span className=' text-xl'>$ {numberBasicFormat(custumerChange)}</span>
            </div>
          </div>
        </div>
        {/* Botones del formulario */}
        <div className="flex justify-end gap-3 flex-wrap pt-4">
          <Button
            type="submit"
            color='yellow'
            className='flex justify-center items-center min-w-[120px]'
            disabled={false}
          >
            <MdOutlinePaid className="w-4 h-4" />
            Cobrar despues
          </Button>
          <Button
            type="submit"
            className='flex justify-center items-center min-w-[120px]'
            disabled={false}
          >
            <MdPaid className="w-4 h-4" />
            Cobrar venta
          </Button>
          <Button
            type="button"
            color="gray"
            className="flex items-center"
            onClick={closePaymentModal}
          >
            <IoClose className="mr-2 w-4 h-4" />
            Cerrar
          </Button>
        </div>
      </div>
    </TemplateModal>
  )
}

export { SalePaymentModal }
