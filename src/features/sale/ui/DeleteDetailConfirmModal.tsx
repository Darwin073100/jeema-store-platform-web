import React from 'react'
import clsx from 'clsx';
import { Button } from '@/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/ui/components/modals/TemplateModal';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { IoMdTrash } from 'react-icons/io';
import { useDeleteDetail } from '../hooks/useDeleteDetail';

const DeleteDetailConfirmModal = () => {
  const { 
    detailSelected, handlePhysicalDeleteSaleDetail, loading, closeSaleModal, saleModals
  } = useDeleteDetail();
  return (
    <TemplateModal size='md' isOpen={saleModals==='deleteDetailModal'} onClose={closeSaleModal} title='Eliminar producto de la venta'>
      <div className="p-6 space-y-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <p>¿Esta seguro de eliminar <span className='text-red-600'>{detailSelected?.quantity ?? 0.000}</span> <span className='font-bold'>{ detailSelected?.productNameAtSale ?? 'S/N'}</span>?</p>
        </div>
        {/* Botones del formulario */}
        <div className="flex justify-end gap-3 flex-wrap pt-4">
          <Button
            onClick={()=> handlePhysicalDeleteSaleDetail()}
            type="button"
            color='red'
            className={clsx(`flex justify-center items-center min-w-[120px]`)}
            disabled={loading==='deleteDetailLoading'}
          >
             { loading==='deleteDetailLoading'
              ? <Spinner/>
              : <><IoMdTrash className="w-4 h-4" />Eliminar</> }
          </Button>
          <Button
            onClick={()=> closeSaleModal()}
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

export { DeleteDetailConfirmModal }
