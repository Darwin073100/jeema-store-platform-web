'use client'
import React from 'react'
import clsx from 'clsx';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { MdClosedCaptionDisabled } from 'react-icons/md';
import { useCashUIStore } from '../stores/cash-ui.store';
import { useCashStore } from '../stores/cash.store';
import { useUpdateCashRegisterStatus } from '../hooks/useUpdateCashRegisterStatus';

const DeactivateCashRegisterConfirmModal = () => {
  const { cashModal, closeCashModal, loading } = useCashUIStore();
  const { cashRegisterSelected } = useCashStore();
  const { handleConfirmDeactivate } = useUpdateCashRegisterStatus();

  return (
    <TemplateModal size='md' isOpen={cashModal === 'deactivateCashRegister'} onClose={closeCashModal} title='Desactivar caja'>
      <div className="p-6 space-y-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <p>¿Está seguro de desactivar la caja &quot;{cashRegisterSelected?.name}&quot;?</p>
        </div>
        <div className="flex justify-end gap-3 flex-wrap pt-4">
          <Button
            onClick={() => handleConfirmDeactivate()}
            type="button"
            color='red'
            className={clsx(`flex justify-center items-center min-w-[120px]`)}
            disabled={loading === 'deactivateCashRegister'}
          >
            {loading === 'deactivateCashRegister' ? <Spinner /> : <MdClosedCaptionDisabled />}
            Desactivar
          </Button>
          <Button
            onClick={() => closeCashModal()}
            type="button"
            color="gray"
            className="flex items-center"
          >
            <IoClose className="mr-2 w-4 h-4" />
            Cancelar
          </Button>
        </div>
      </div>
    </TemplateModal>
  )
}

export { DeactivateCashRegisterConfirmModal }
