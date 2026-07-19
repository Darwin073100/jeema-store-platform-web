import React, { useEffect } from 'react'
import clsx from 'clsx';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { IoMdTrash } from 'react-icons/io';
import { useCancelSale } from '../hooks/useCancelSale';
import { useSaleStore } from '../stores/sale.store';

const CancelSaleConfirmModal = () => {
  const { 
    saleModals, handleCancelSale, loading, closeSaleModal
  } = useCancelSale();
  const { saleId } = useSaleStore();

    useEffect(() => {
      const handleKeyDown = (event: any) => {
        if (event.key === 'F6') {
          event.preventDefault(); // anula el comportamiento por defecto (ayuda del navegador)
          // tu función personalizada
          handleCancelSale();
        }
      }
      window.addEventListener('keydown', handleKeyDown);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [saleModals, saleId]);

  return (
    <TemplateModal size='md' isOpen={saleModals==='cancelSaleModal'} onClose={closeSaleModal} title='Cancelar la venta actual'>
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
            disabled={loading==='cancelSaleLoading'}
          >
             { loading==='cancelSaleLoading'
              ? <Spinner/>
              : <IoMdTrash className="w-4 h-4" /> }
              Cancelar venta
              <div className="h-full flex items-start">
                <span className="text-sm p-1 rounded-sm bg-red-200 text-red-600">F6</span>
              </div>
          </Button>
          <Button
            onClick={()=> closeSaleModal()}
            type="button"
            color="gray"
            className="flex items-center"
          >
            <IoClose className="mr-2 w-4 h-4" />
            Salir
            <div className="h-full flex items-start">
              <span className="text-sm p-1 rounded-sm bg-gray-200 text-gray-600">Esc</span>
            </div>
          </Button>
        </div>
      </div>
    </TemplateModal>
  )
}

export { CancelSaleConfirmModal }
