'use client'
import React from 'react';
import { TemplateModal } from '@/ui/components/modals/TemplateModal';
import { TextInput } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import { Button } from '@/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { useCashUIStore } from '../../infraestructure/stores/cash-ui.store';
import { useOpenCashSession } from '../hooks/useOpenCashSession';
import { useCashStore } from '../../infraestructure/stores/cash.store';
import { LiaCashRegisterSolid } from 'react-icons/lia';

interface Props {
}

const OpenCashSessionModal = ({}: Props) => {
  const { register, errors, handleSubmit, onSubmit, loading } = useOpenCashSession()
  const { cashModal, closeCashModal } = useCashUIStore();
  const { cashRegisterSelected } = useCashStore();

  return (
    <TemplateModal isOpen={cashModal === 'openCashSession'} onClose={closeCashModal} title={`Apertura de ${cashRegisterSelected?.name.toUpperCase()}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
        <div>
          <LabelInput value="Cantidad para aperturar." required="yes" />
          <TextInput
            {...register('startBalance')}
            autoFocus
            type='number'
            error={!!errors.startBalance}
            errorMessage={errors.startBalance?.message}
            name="startBalance"
            step='0.01'
            placeholder="Ej: 2000" />
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <Button>
            {loading === 'openCashSession' ? <Spinner /> : <LiaCashRegisterSolid />}
            Aperturar
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

export { OpenCashSessionModal }
