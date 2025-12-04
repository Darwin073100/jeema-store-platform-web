'use client'
import React from 'react';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { LiaCashRegisterSolid } from 'react-icons/lia';
import { useCashUIStore } from '@/features/cash/infraestructure/stores/cash-ui.store';
import { useCashStore } from '@/features/cash/infraestructure/stores/cash.store';
import { useCashSessionClose } from '../../hooks/useCashSessionClose';

interface Props {
}

const CashSessionCloseModal = ({}: Props) => {
  const { register, errors, handleSubmit, onSubmit, loading } = useCashSessionClose()
  const { cashModal, closeCashModal } = useCashUIStore();
  const { cashRegisterSelected } = useCashStore();

  return (
    <TemplateModal isOpen={cashModal === 'closeCashSession'} onClose={closeCashModal} title={`Corte de caja`}>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
        <div>
          <LabelInput value="Registrar sobrante" required="no" />
          <TextInput
            {...register('diference')}
            autoFocus
            type='number'
            error={!!errors.diference}
            errorMessage={errors.diference?.message}
            name="diference"
            step='0.01'
            min={0}
            placeholder="Ej: 2000" />
        </div>
        <div>
          <LabelInput value="Notas o comentarios del cierre" required="no" />
          <TextInput
            {...register('closingNotes')}
            error={!!errors.closingNotes}
            errorMessage={errors.closingNotes?.message}
            name="closingNotes"
            placeholder="Ej: Me sobraron $10." />
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <Button>
            {loading === 'closeCashSession' ? <Spinner /> : <LiaCashRegisterSolid />}
            Finalizar corte
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

export { CashSessionCloseModal }
