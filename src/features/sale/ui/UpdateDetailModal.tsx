import React from 'react'
import clsx from 'clsx';
import { Button } from '@/ui/components/buttons';
import { IoClose, IoSave } from 'react-icons/io5';
import { TemplateModal } from '@/ui/components/modals/TemplateModal';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { TextInput } from '@/ui/components/inputs';
import { useUpdateDetailModal } from '../hooks/useUpdateDetailModal';
import { numberBasicFormat } from '@/shared/lib/utils/number-formatter';

const UpdateDetailModal = () => {
  const { 
    closeUpdateDetailModal, updateDetailModal, detailSelected, detailQuantity, setDetailQuantity, detailCurrentTotal, 
    saleFor, detailPrice,
  } = useUpdateDetailModal();
 return (
    <TemplateModal size='lg' isOpen={updateDetailModal} onClose={closeUpdateDetailModal} title='Producto en venta'>
      <div className="p-6 space-y-4">
        <div className="flex flex-col justify-center items-center gap-2.5">
          <span className='text-green-600 font-bold'>{detailSelected?.productNameAtSale ?? 'S/N'}</span>
          <div>
            <div className='flex flex-col items-center'>
              <div className='flex gap-1 items-center'>
                <span>Precio</span>
                <span className='text-sm text-blue-600 bg-blue-100 p-1 rounded-lg'>{ saleFor }</span>
              </div>
              <span>
                <span className='text-purple-600 text-2xl'>
                  {`$${numberBasicFormat(detailPrice)}`}
                </span>
              </span>
            </div>
            <div className='flex flex-col items-center'>
              <label htmlFor="">Cantidad</label>
              <div className='flex items-center gap-2'>
                <TextInput
                  onChange={(e)=> setDetailQuantity(Number(e.target.value ?? 0))}
                  value={detailQuantity}
                  autoFocus={true}
                  type='number'
                  min={0} 
                  placeholder='Cantidad' 
                  className='text-center'/>
              </div>
              
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span>Total</span>
            <span className='text-purple-600 text-2xl'>{`$${numberBasicFormat(detailCurrentTotal ?? 0)}`}</span>
          </div>
        </div>
        {/* Botones del formulario */}
        <div className="flex justify-end gap-3 flex-wrap pt-4">
          <Button
            // onClick={()=> handlePhysicalDeleteSaleDetail()}
            type="button"
            color='purple'
            className={clsx(`flex justify-center items-center min-w-[120px]`)}
            // disabled={isLoading}
          >
             { false
              ? <Spinner/>
              : <><IoSave className="w-4 h-4" />Aplicar cambios</> }
          </Button>
          <Button
            onClick={()=> closeUpdateDetailModal()}
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

export { UpdateDetailModal }
