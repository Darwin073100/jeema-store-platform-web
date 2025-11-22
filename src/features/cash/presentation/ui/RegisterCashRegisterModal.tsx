'use client'
import React from 'react';
import { TemplateModal } from '@/ui/components/modals/TemplateModal';
import { TextInput } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import { Button } from '@/ui/components/buttons';
import { HiUserAdd } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { useCashUIStore } from '../../infraestructure/stores/cash-ui.store';
import { useRegisterCashRegister } from '../hooks/useRegisterCashRegister';
import { MdAdd } from 'react-icons/md';

interface Props {
}

const RegisterCashRegisterModal = ({}: Props) => {
  const { register, errors, handleSubmit, onSubmit, loading } = useRegisterCashRegister()
  const { cashModal, closeCashModal } = useCashUIStore();

  return (
    <TemplateModal isOpen={cashModal === 'registerCashRegister'} onClose={closeCashModal} title='Agrega una nueva caja'>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
        <div>
          <LabelInput value="Nombre de la caja" required="yes" />
          <TextInput
            {...register('name')}
            autoFocus
            type='text'
            error={!!errors.name}
            errorMessage={errors.name?.message}
            name="name"
            placeholder="Ej: Caja 1" />
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <Button>
            {loading === 'registerCashRegister' ? <Spinner /> : <MdAdd />}
            Registrar
          </Button>
          <Button color='gray' onClick={() => closeCashModal()}>
            <IoClose />
            Cancelar
          </Button>
        </div>
      </form>
    </TemplateModal>
  )
}

export { RegisterCashRegisterModal }
