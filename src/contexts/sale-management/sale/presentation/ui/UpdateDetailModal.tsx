import React from 'react'
import clsx from 'clsx';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose, IoSave } from 'react-icons/io5';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { TextInput } from '@/shared/ui/components/inputs';
import { useUpdateDetailModal } from '../hooks/useUpdateDetailModal';
import { numberBasicFormat } from '@/shared/lib/utils/number-formatter';
import { FiGitCommit, FiGitPullRequest } from 'react-icons/fi';
import { SaleForEnum } from '../../domain/enums/sale-for.enum';

const UpdateDetailModal = () => {
  const { 
    closeSaleModal, saleModals, detailSelected, detailQuantity, setDetailQuantity, detailCurrentTotal, 
    saleFor, detailPrice, handleUpdateQuantityDetail, loading, handleApplyManualSaleFor
  } = useUpdateDetailModal();
 return (
    <TemplateModal size='lg' isOpen={saleModals==='updateDetailModal'} onClose={closeSaleModal} title='Producto en venta'>
      <div className="p-6 space-y-4">
        <div className="flex flex-col justify-center items-center gap-2.5">
          <div>
            <Button onClick={()=> handleApplyManualSaleFor(detailSelected ?? undefined)} color='blue' size='sm' className='w-full' 
              title='Al dar click al boton aplicas manualmente Ej: Menudeo o Mayoreo'>
              { detailSelected?.saleFor === SaleForEnum.MANY 
                ? loading==='aplyManualSaleForLoading'? <Spinner/> :<> <FiGitCommit />Aplicar Menudeo</> 
                : loading==='aplyManualSaleForLoading'? <Spinner/> :<> <FiGitPullRequest />Aplicar Mayoreo</>
              }
            </Button>
          </div>
          <span className='text-green-600 font-bold'>{detailSelected?.productNameAtSale ?? 'S/N'}</span>
          <div>
            <div className='flex flex-col items-center'>
              <div className='flex gap-1 items-center'>
                <span>Precio</span>
                <span className='text-sm text-blue-600 bg-blue-100 p-1 rounded-lg'>{ saleFor.toString() }</span>
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
            onClick={()=> handleUpdateQuantityDetail()}
            type="button"
            color='purple'
            className={clsx(`flex justify-center items-center min-w-[120px]`)}
            disabled={loading === 'updateDetailLoading'}
          >
             { loading === 'updateDetailLoading'
              ? <Spinner/>
              : <><IoSave className="w-4 h-4" />Aplicar cambios</> }
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

export { UpdateDetailModal }
