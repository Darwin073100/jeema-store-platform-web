'use client'
import React from 'react';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { LiaCashRegisterSolid } from 'react-icons/lia';
import { useSaleUIStore } from '../../infraestructure/stores/sale.ui.store';
import { useReturnsProducts } from '../../hooks/details/useReturnsProducts';
import { useReturnsStore } from '@/features/returns/infraestructure/stores/returns.store';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';

interface Props {
}

const ReturnsPoductsModal = ({}: Props) => {
  const {selectDetail} = useReturnsStore();
  const { register, errors, handleSubmit, onSubmit } = useReturnsProducts()
  const { saleModals, closeSaleModal, loading } = useSaleUIStore();

  return (
    <TemplateModal isOpen={saleModals === 'returnsModal'} onClose={closeSaleModal} title={`Devolución de producto.`}>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
        <div>
          <div className='bg-blue-300 border border-blue-700 rounded-2xl p-3 mb-4'>
            <div className='text-lg'>{selectDetail?.productNameAtSale}</div>
            <div className='text-sm'>Precio unitario: {numberMoneyFormat(selectDetail?.unitPriceAtSale ?? 0)}</div>
          </div>
        </div>
        <div>
          <LabelInput value="Unidades devueltas C/" required="yes" />
          <TextInput
            {...register('quantityReturn')}
            type='number'
            error={!!errors.quantityReturn}
            errorMessage={errors.quantityReturn?.message}
            name="quantityReturn"
            step='0.001'
            placeholder="Ej: 3" />
        </div>
        <div>
          <LabelInput value="Dinero a devolver $" required="yes" />
          <TextInput
            {...register('amountReturn')}
            type='number'
            error={!!errors.amountReturn}
            errorMessage={errors.amountReturn?.message}
            name="amountReturn"
            step='0.01'
            placeholder="Ej: 300" />
        </div>
        <div>
          <LabelInput value="Comentarios" required="yes" />
          <TextInput
            {...register('notes')}
            error={!!errors.notes}
            errorMessage={errors.notes?.message}
            name="notes"
            placeholder="Ej: El producto tenia defectos." />
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <Button autoFocus>
            {loading === 'returnsLoading' ? <Spinner /> : <LiaCashRegisterSolid />}
            Confirmar
          </Button>
          <Button color='gray' onClick={() => closeSaleModal()}>
            <IoClose />
            Cancelar
          </Button>
        </div>
      </form>
    </TemplateModal>
  )
}

export { ReturnsPoductsModal }
