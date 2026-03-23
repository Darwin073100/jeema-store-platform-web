'use client'
import clsx from 'clsx';
import React from 'react'
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { SelectMenu, TextInput } from '@/shared/ui/components/inputs';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { TransactionTypeEntity } from '@/features/transaction/domain/entities/transaction-type.entity';
import { useSaleUIStore } from '../../../../sale-management/sale/presentation/stores/sale.ui.store';
import { LabelInput } from '@/shared/ui/components/labels';
import { TextArea } from '@/shared/ui/components/inputs/TextInput copy';
import { BiSave } from 'react-icons/bi';
import { FcBearish, FcBullish, FcRules, FcSalesPerformance } from 'react-icons/fc';
import { useCashTransactionModal } from '../hooks/useCashTransactionModal';
import { useCashUIStore } from '../stores/cash-ui.store';
interface Props {
    incomes: TransactionTypeEntity[],
    expenses: TransactionTypeEntity[],
}
const CashTransactionModal = ({ expenses, incomes}:Props) => {
  const { cashModal, closeCashModal } = useCashUIStore();
  const { handleTransactionsTypeInput, errors, handleSubmit, loading, onSubmit, register } = useCashTransactionModal();
  return (
    <TemplateModal size='full' isOpen={cashModal==='cashTransaction'} onClose={closeCashModal} title='Movimientos de efectivo'>
      <form className="p-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>
            Debes selecionar <span className='font-bold'>un</span> típo de <span className='text-green-600 font-bold'>Ingreso </span> 
             o <span className='font-bold'>un</span> <span className='text-red-600 font-bold'>Egreso</span>, para tener 
            información detallada del movimiento que se realiza con el efectivo en caja.
          </p>
          <div className='my-4 w-full flex gap-4 items-center justify-center'>
            <div className='w-full'>
              <LabelInput Icon={FcBullish} value='Opciones' description='Selecciona una opción para registrar que tipo de movimiento es lo que entra o sale de caja.'/>
              <SelectMenu
                {...register('transactionTypeId')}
                errorMessage={errors.transactionTypeId?.message} 
                error={!!errors.transactionTypeId} 
                name='transactionTypeId'
                items={[...handleTransactionsTypeInput(incomes),...handleTransactionsTypeInput(expenses)]} />
            </div>
          </div> 
          <div className='w-full'>
            <LabelInput Icon={FcSalesPerformance} value='Monto' description='Ingresa el monto del movimiento.'/>
            <TextInput 
              {...register('amount')}
              errorMessage={errors.amount?.message} 
              error={!!errors.amount} 
              name='amount'
              type='number'
              placeholder='Ingresa el monto'/>
          </div>
          <div className='w-full'>
            <LabelInput Icon={FcRules} value='Nota o comentario' description='Ingresa alguna nota adicional'/>
            <TextArea
              {...register('description')}
              errorMessage={errors.description?.message} 
              error={!!errors.description} 
              name='description'
              rows={3}
              placeholder='Ingresa alguna nota o descripción'/>
          </div>
        </div>
        {/* Botones del formulario */}
        <div className="flex justify-end gap-3 flex-wrap pt-4">
          <Button>
            {loading==='cashTransaction'? <Spinner size={15}/>: <BiSave />}
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
      </form>
    </TemplateModal>
  )
}

export { CashTransactionModal }
