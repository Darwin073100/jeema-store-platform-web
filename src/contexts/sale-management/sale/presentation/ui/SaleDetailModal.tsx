'use client'
import React from 'react'
import { Button } from '@/shared/ui/components/buttons';
import { IoClose, IoSave } from 'react-icons/io5';
import { IoMdTrash } from 'react-icons/io';
import { FiGitCommit, FiGitPullRequest } from 'react-icons/fi';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { Skeleton } from '@/shared/ui/components/loadings/Skeleton';
import { TextInput } from '@/shared/ui/components/inputs';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { ImageThumbnail } from '@/contexts/image-management/image/presentation/ui';
import { numberBasicFormat, numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { SaleForEnum } from '../../domain/enums/sale-for.enum';
import { MAX_DETAIL_QUANTITY, useSaleDetailModal } from '../hooks/useSaleDetailModal';

const QUANTITY_FORM_ID = 'sale-detail-quantity-form';

/**
 * Modal único de un producto en la venta: cambia la cantidad, alterna menudeo/mayoreo o lo elimina
 * (con confirmación en línea). Se abre con clic derecho, doble clic o el botón ⋮ de la fila.
 */
const SaleDetailModal = () => {
  const {
    isOpen, closeSaleModal, detailSelected, detailQuantity, setDetailQuantity, detailPrice, detailTotal,
    saleFor, salePriceOne, salePriceMany, isLoadingPrices, pricesError, isQuantityTooLarge, canApply, mode,
    requestDelete, cancelDelete, loading, applyQuantity, toggleSaleFor, deleteDetail,
  } = useSaleDetailModal();

  const productName = detailSelected?.productNameAtSale ?? 'S/N';
  const isBusy = loading === 'updateDetailLoading' || loading === 'aplyManualSaleForLoading' || loading === 'deleteDetailLoading';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void applyQuantity();
  };

  return (
    <TemplateModal size='lg' isOpen={isOpen} onClose={closeSaleModal} title='Producto en venta'>
      <div className="p-6 space-y-5">
        {/* Producto */}
        <div className="flex items-center gap-4">
          <ImageThumbnail src={detailSelected?.product?.imageUrl ?? null} alt={productName} size={64} zoomable />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-green-700 wrap-break-word">{productName}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge type="gray">{detailSelected?.productBarCodeAtSale ?? 'S/C'}</Badge>
              <Badge>{detailSelected?.productUnitAtSale ?? 'S/U'}</Badge>
            </div>
          </div>
        </div>

        {/* Precios de inventario */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <span className="block text-sm text-gray-600">Menudeo</span>
            {isLoadingPrices
              ? <Skeleton className="h-6 w-20 mx-auto mt-1" />
              : <span className="text-lg font-bold text-blue-700">{numberMoneyFormat(salePriceOne)}</span>}
          </div>
          <div className="rounded-lg bg-green-50 p-3 text-center">
            <span className="block text-sm text-gray-600">Mayoreo</span>
            {isLoadingPrices
              ? <Skeleton className="h-6 w-20 mx-auto mt-1" />
              : <span className="text-lg font-bold text-green-700">{salePriceMany !== null ? numberMoneyFormat(salePriceMany) : 'N/A'}</span>}
          </div>
        </div>
        {pricesError && (
          <p role="alert" className="text-sm text-red-600 text-center">
            No se pudieron cargar los precios del producto. Puedes eliminarlo, pero no cambiar su cantidad.
          </p>
        )}

        {/* Cantidad */}
        <form id={QUANTITY_FORM_ID} onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <label htmlFor="sale-detail-quantity" className="font-medium">Cantidad</label>
          <TextInput
            id="sale-detail-quantity"
            onChange={(e) => setDetailQuantity(Number(e.target.value || 0))}
            onFocus={(e) => e.target.select()}
            value={detailQuantity}
            autoFocus
            type="number"
            min={0}
            step="any"
            placeholder="Cantidad"
            disabled={mode === 'confirmDelete'}
            className="text-center text-xl max-w-40" />
          {detailQuantity <= 0 && (
            <span className="text-sm text-amber-700">Para quitar el producto usa «Eliminar de la venta».</span>
          )}
          {isQuantityTooLarge && (
            <span role="alert" className="text-sm text-red-600">
              La cantidad no puede ser mayor a {numberBasicFormat(MAX_DETAIL_QUANTITY)}. ¿Escaneaste un código por error?
            </span>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Precio</span>
              <Badge type={saleFor === SaleForEnum.ONE ? 'blue' : 'green'} size="sm">{saleFor}</Badge>
              {isLoadingPrices
                ? <Skeleton className="h-7 w-20" />
                : <span className="text-2xl text-purple-600">${numberBasicFormat(detailPrice)}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Total</span>
              {isLoadingPrices
                ? <Skeleton className="h-7 w-24" />
                : <span className="text-2xl font-bold text-purple-600">${numberBasicFormat(detailTotal)}</span>}
            </div>
          </div>
          <Button
            type="button"
            onClick={() => void toggleSaleFor()}
            color="blue"
            size="sm"
            disabled={isLoadingPrices || !!pricesError || isBusy || mode === 'confirmDelete'}
            title="Aplica manualmente el precio de menudeo o mayoreo">
            {loading === 'aplyManualSaleForLoading'
              ? <Spinner />
              : detailSelected?.saleFor === SaleForEnum.MANY
                ? <><FiGitCommit />Aplicar menudeo</>
                : <><FiGitPullRequest />Aplicar mayoreo</>}
          </Button>
        </form>

        {/* Acciones */}
        {mode === 'edit' ? (
          <div className="flex justify-between gap-3 flex-wrap pt-4 border-t border-gray-200">
            <Button type="button" color="red" onClick={requestDelete} disabled={isBusy} className="flex items-center">
              <IoMdTrash className="w-4 h-4" />Eliminar de la venta
            </Button>
            <div className="flex gap-3 flex-wrap">
              <Button type="button" color="gray" onClick={closeSaleModal} className="flex items-center">
                <IoClose className="w-4 h-4" />Cancelar
              </Button>
              <Button
                type="submit"
                form={QUANTITY_FORM_ID}
                color="purple"
                disabled={!canApply || isBusy}
                className="flex justify-center items-center min-w-36">
                {loading === 'updateDetailLoading'
                  ? <Spinner />
                  : <><IoSave className="w-4 h-4" />Aplicar cambios</>}
              </Button>
            </div>
          </div>
        ) : (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
            <p className="text-center">
              ¿Eliminar <span className="font-bold text-red-600">{numberBasicFormat(Number(detailSelected?.quantity ?? 0))}</span>
              {' × '}<span className="font-bold">{productName}</span> de la venta?
            </p>
            <div className="flex justify-end gap-3 flex-wrap">
              {/* El foco va a «Volver» y no a «Sí, eliminar»: un Enter accidental (o un escaneo) no borra. */}
              <Button type="button" color="gray" onClick={cancelDelete} autoFocus disabled={loading === 'deleteDetailLoading'}>
                Volver
              </Button>
              <Button
                type="button"
                color="red"
                onClick={() => void deleteDetail()}
                disabled={loading === 'deleteDetailLoading'}
                className="flex justify-center items-center min-w-36">
                {loading === 'deleteDetailLoading'
                  ? <Spinner />
                  : <><IoMdTrash className="w-4 h-4" />Sí, eliminar</>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </TemplateModal>
  )
}

export { SaleDetailModal }
