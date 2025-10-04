import React from 'react'
import clsx from 'clsx';
import { Button } from '@/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/ui/components/modals/TemplateModal';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { IoMdTrash } from 'react-icons/io';
import { useCancelSale } from '../hooks/useCancelSale';

const CancelSaleConfirmModal = () => {
  const { 
    cancelSaleModal, handleCancelSale, isCancelSaleLoading, closeCancelSaleModal
  } = useCancelSale();
  return (
    <TemplateModal size='md' isOpen={cancelSaleModal} onClose={closeCancelSaleModal} title='Cancelar la venta actual'>
      <div className="p-6 space-y-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <p>¿Esta seguro de eliminar la venta actual?</p> 
        </div>
        {/* Botones del formulario */}
        <div className="flex justify-end gap-3 flex-wrap pt-4">
          <Button
            onClick={()=> handleCancelSale()}
            type="button"
            color='red'
            className={clsx(`flex justify-center items-center min-w-[120px]`)}
            disabled={isCancelSaleLoading}
          >
             { isCancelSaleLoading
              ? <Spinner/>
              : <><IoMdTrash className="w-4 h-4" />Cancelar venta</> }
          </Button>
          <Button
            onClick={()=> closeCancelSaleModal()}
            type="button"
            color="gray"
            className="flex items-center"
          >
            <IoClose className="mr-2 w-4 h-4" />
            Salir
          </Button>
        </div>
      </div>
    </TemplateModal>
  )
}

export { CancelSaleConfirmModal }
