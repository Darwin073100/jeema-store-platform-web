'use client'
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement'
import { Button } from '@/shared/ui/components/buttons'
import React, { useEffect } from 'react'
import { HiOutlineCalendar, HiOutlineCube, HiOutlineQrcode, HiOutlineTag, HiOutlineTicket, HiPencil, HiTrash } from 'react-icons/hi'
import { UpdateProductModal } from './UpdateProductModal'
import { DeleteProductModal } from './DeleteProductModal'
import { TbBoxMultiple, TbPackage } from 'react-icons/tb'
import Barcode from 'react-barcode'
import { formatDate } from '@/shared/lib/utils/date-formatter'
import { useDeleteProductModal } from '../../hooks/useDeleteProductModal'
import { useUpdateProductModal } from '../../hooks'
import { FloatMessage } from '@/shared/ui/components/messages'
import { useRegisterInventoryItemStore } from '@/contexts/inventory-management/inventory/presentation/stores/register-inventory-item.store'
import { useInventoryItemUIStore } from '@/contexts/inventory-management/inventory/presentation/stores/inventory-item-ui.store'
import { IProduct } from '@/contexts/product-management/product/presentation/interfaces/IProduct'
import { useProductStore } from '../../stores/product.store'
import { BiSolidPurchaseTag } from 'react-icons/bi'
import { CardGrid } from '@/shared/ui/components/grids/CardGrid'
interface Props {
    product: IProduct;
}
const ProductDetail = ({ product }: Props) => {
    const { handleOpenModalDeleteProduct } = useDeleteProductModal();
    const { handleOpenUpdateProductModal } = useUpdateProductModal();
    const { setInventoryItems } = useRegisterInventoryItemStore();
    const { floatMessageState } = useInventoryItemUIStore();
    const { setProduct } = useProductStore();

    useEffect(() => {
        setProduct(product);
        setInventoryItems(product.inventory?.inventoryItems ?? []);
    }, [product]);

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
            <div className="">
                <div className="my-4 flex gap-2 items-center">
                    <BiSolidPurchaseTag />
                    <h2 className="text-lg font-bold">Información del producto</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <CardGrid
                        title="Nombre del producto"
                        children={product.name}
                        icon={<HiOutlineTag className="w-4 h-4" />}
                    />
                    <CardGrid title='Código de barra universal' icon={<HiOutlineQrcode />}>
                        <Barcode
                            format='CODE128'
                            value={product.universalBarCode ?? ''}
                            width={1}
                            height={50}
                            fontSize={16} />
                    </CardGrid>

                    <CardGrid
                        title="Unidad de medida para ventas"
                        children={product.unitOfMeasure.toUpperCase()}
                        icon={<HiOutlineCube className="w-4 h-4" />}
                    />
                    <CardGrid
                        title="Stock mínimo global"
                        children={product.minStockGlobal.toString()}
                        icon={<TbBoxMultiple className="w-4 h-4" />}
                    />
                    <CardGrid
                        title="Categoría"
                        children={product.category?.name || 'Sin categoría'}
                        icon={<HiOutlineTag className="w-4 h-4" />}
                    />
                    <CardGrid
                        title="Marca"
                        children={product.brand?.name || 'Sin marca'}
                        icon={<HiOutlineTag className="w-4 h-4" />}
                    />
                    <CardGrid
                        title="Temporada"
                        children={product.season?.name || 'Todo el año'}
                        icon={<HiOutlineCalendar className="w-4 h-4" />}
                    />
                    <CardGrid
                        title="Última Actualización"
                        children={formatDate(product.updatedAt)}
                        icon={<HiOutlineCalendar className="w-4 h-4" />}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                    <CardGrid
                        title="Descripción del producto"
                        children={product.description}
                        icon={<HiOutlineTicket className="w-4 h-4" />}
                    />
                </div>
            </div>
        </>
    )
}

export default ProductDetail
