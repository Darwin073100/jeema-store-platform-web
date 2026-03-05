'use client'
import clsx from 'clsx';
import React from 'react'
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { SelectMenu, TextInput } from '@/shared/ui/components/inputs';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { TransactionTypeEntity } from '@/features/transaction/domain/entities/transaction-type.entity';
import { useSaleUIStore } from '../../../sale/infraestructure/stores/sale.ui.store';
import { LabelInput } from '@/shared/ui/components/labels';
import { TextArea } from '@/shared/ui/components/inputs/TextInput copy';
import { BiSave } from 'react-icons/bi';
import { FcBearish, FcBullish, FcRules, FcSalesPerformance } from 'react-icons/fc';
import { useCashTransactionModal } from '../hooks/useCashTransactionModal';
import { useCashUIStore } from '../../infraestructure/stores/cash-ui.store';
interface Props {
    incomes: TransactionTypeEntity[],
    expenses: TransactionTypeEntity[],
}
const CashTransactionModal = ({ expenses, incomes}:Props) => {
  const { cashModal, closeCashModal } = useCashUIStore();
  const { handleTransactionsTypeInput } = useCashTransactionModal();
  return (
    <TemplateModal size='full' isOpen={cashModal==='cashTransaction'} onClose={closeCashModal} title='Movimientos de efectivo'>
      <div className="p-6 space-y-4">
        <div>
          <p>
            Debes selecionar <span className='font-bold'>un</span> <span className='text-green-600 font-bold'>Ingreso </span> 
             o <span className='font-bold'>un</span> <span className='text-red-600 font-bold'>Egreso</span>, para tener 
            información detallada del movimiento que se realiza con el efectivo en caja.
          </p>
          <div className='my-4 w-full flex gap-4 items-center justify-center'>
            <div className='w-full'>
              <LabelInput Icon={FcBullish} value='Ingreso' description='Selecciona una opción para registrar que tipo de ingreso es lo que llega a caja.'/>
              <SelectMenu items={handleTransactionsTypeInput(incomes)} />
            </div>
            <div className='w-full'>
              <LabelInput Icon={FcBearish} value='Egreso' description='Selecciona una opción para registrar que tipo de egreso es lo que sale a caja.'/>
              <SelectMenu items={handleTransactionsTypeInput(expenses)} />
            </div>
          </div> 
          <div className='w-full'>
            <LabelInput Icon={FcSalesPerformance} value='Monto' description='Ingresa el monto del movimiento.'/>
            <TextInput 
              type='number'
              placeholder='Ingresa el monto'/>
          </div>
          <div className='w-full'>
            <LabelInput Icon={FcRules} value='Nota o comentario' description='Ingresa el monto del movimiento.'/>
            <TextArea
              rows={3}
              placeholder='Ingresa el monto'/>
          </div>
        </div>
        {/* Botones del formulario */}
        <div className="flex justify-end gap-3 flex-wrap pt-4">
          <Button>
            <BiSave />
            Registrar
          </Button>
          <Button
            onClick={()=> closeCashModal()}
            type="button"
            color="gray"
            className="flex items-center"
          >
            <IoClose className="mr-2 w-4 h-4" />
            Cerrar ventana
          </Button>
        </div>
      </div>
    </TemplateModal>
  )
}

export { CashTransactionModal }
