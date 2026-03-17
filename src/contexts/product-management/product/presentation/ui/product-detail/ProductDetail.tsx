'use client'
import { HideElement } from '@/features/auth/ui/HideElement'
import { Button } from '@/shared/ui/components/buttons'
import React, { useEffect } from 'react'
import { HiOutlineCalendar, HiOutlineCube, HiOutlineQrcode, HiOutlineTag, HiOutlineTicket, HiPencil, HiTrash } from 'react-icons/hi'
import { UpdateProductModal } from './UpdateProductModal'
import { DeleteProductModal } from './DeleteProductModal'
import { TbBoxMultiple, TbPackage } from 'react-icons/tb'
import { InfoCard } from '@/shared/ui/components/cards'
import Barcode from 'react-barcode'
import { formatDate } from '@/shared/lib/utils/date-formatter'
import { useDeleteProductModal } from '../../../../../../features/product/hooks/useDeleteProductModal'
import { useUpdateProductModal } from '../../../../../../features/product/hooks'
import { FloatMessage } from '@/shared/ui/components/messages'
import { useRegisterInventoryItemStore } from '@/features/inventory/infraestructura/stores/register-inventory-item.store'
import { useInventoryItemUIStore } from '@/features/inventory/infraestructura/stores/inventory-item-ui.store'
import { IProduct } from '@/contexts/product-management/product/presentation/interfaces/IProduct'
interface Props {
    product: IProduct;
}
const ProductDetail = ({ product }: Props) => {
    const { handleOpenModalDeleteProduct } = useDeleteProductModal();
    const { handleOpenUpdateProductModal } = useUpdateProductModal();
    const { setInventoryItems } = useRegisterInventoryItemStore();
    const { floatMessageState } = useInventoryItemUIStore();

    useEffect(()=>{
        setInventoryItems(product.inventory?.inventoryItems ?? []);
    },[product]);
    
    return (
        <>
            <div className="flex gap-2">
                <FloatMessage
                    key='product-details-general' 
                    {...floatMessageState} />
                <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                    <Button color='yellow' onClick={() => handleOpenUpdateProductModal(product)}>
                        <HiPencil className="w-4 h-4" />
                        Modificar
                    </Button>
                    <Button color='red' onClick={() => handleOpenModalDeleteProduct(product)}>
                        <HiTrash className="w-4 h-4" />
                        Eliminar
                    </Button>
                </HideElement>
            </div>
            <UpdateProductModal />
            <DeleteProductModal />
            {/* Información del producto */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <TbPackage className="w-5 h-5 text-blue-600" />
                        Información del producto
                    </h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoCard
                            label="Nombre del producto"
                            value={product.name}
                            icon={<HiOutlineTag className="w-4 h-4" />}
                        />
                        <div className={`bg-gray-50 border border-gray-200 rounded-lg p-2`}>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-gray-600"> <HiOutlineQrcode /> </span>
                                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    Código de barra universal
                                </label>
                            </div>
                            <div className="text-gray-900 font-semibold">
                                <Barcode
                                    format='CODE128'
                                    value={product.universalBarCode ?? ''}
                                    width={1}
                                    height={50}
                                    fontSize={16} />
                            </div>
                        </div>
                        <InfoCard
                            label="Unidad de medida para ventas"
                            value={product.unitOfMeasure.toUpperCase()}
                            icon={<HiOutlineCube className="w-4 h-4" />}
                        />
                        <InfoCard
                            label="Stock mínimo global"
                            value={product.minStockGlobal.toString()}
                            icon={<TbBoxMultiple className="w-4 h-4" />}
                        />
                        <InfoCard
                            label="Categoría"
                            value={product.category?.name || 'Sin categoría'}
                            icon={<HiOutlineTag className="w-4 h-4" />}
                        />
                        <InfoCard
                            label="Marca"
                            value={product.brand?.name || 'Sin marca'}
                            icon={<HiOutlineTag className="w-4 h-4" />}
                        />
                        <InfoCard
                            label="Temporada"
                            value={product.season?.name || 'Todo el año'}
                            icon={<HiOutlineCalendar className="w-4 h-4" />}
                        />
                        <InfoCard
                            label="Última Actualización"
                            value={formatDate(product.updatedAt)}
                            icon={<HiOutlineCalendar className="w-4 h-4" />}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <InfoCard
                            label="Descripción del producto"
                            value={product.description}
                            icon={<HiOutlineTicket className="w-4 h-4" />}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail
