'use client'
import { HideElement } from '@/features/auth/ui/HideElement'
import { RegisterInventoryModal } from '@/features/inventory/ui/RegisterInventoryModal'
import { UpdateInventoryModal } from '@/features/inventory/ui/UpdateInventoryModal'
import { Button } from '@/shared/ui/components/buttons'
import React from 'react'
import { HiOutlineLocationMarker, HiOutlineQrcode, HiPencil, HiPlus, HiTrash } from 'react-icons/hi'
import { ImPrinter } from 'react-icons/im'
import { TbBoxMultiple, TbCurrencyDollar, TbTransfer } from 'react-icons/tb'
import { ProductBarCodeModal } from './ProductBarCodesModal'
import Barcode from 'react-barcode'
import { InfoCard } from '@/shared/ui/components/cards'
import { RegisterInventoryItemModal } from '@/features/inventory/ui/RegisterInventoryItemModal'
import { UpdateInventoryItemModal } from '@/features/inventory/ui/UpdateInventoryItemModal'
import { DeleteInventoryItemModal } from '@/features/inventory/ui/DeleteInventoryItemModal'
import { LocalTransferInventoryItemModal } from '@/features/inventory/ui/LocalTransferInventoryModal'
import { ProductEntity } from '../../domain/entities/product.entity'
import { useProductUIStore } from '../../infraestructure/stores/product-ui.store'
import { useRegisterLotModal } from '@/features/lot'
import { useRegisterInventoryModal } from '@/features/inventory/hooks/useRegisterInventoryModal'
import { useUpdateInventoryModal } from '@/features/inventory/hooks/useUpdateInventoryModal'
import { useRegisterInventoryItemModal } from '@/features/inventory/hooks/useRegisterInventoryItemModal'
import { useUpdateInventoryItemModal } from '@/features/inventory/hooks/useUpdateInventoryItemModal'
import { useDeleteInventoryItemModal } from '@/features/inventory/hooks/useDeleteInventoryItemModal'
import { useLocalTransferInventoryItemModal } from '@/features/inventory/hooks/useLocalTransferInventoryItemModal'
import { ProductBarCode51x25Modal } from './ProductBarCodes51x25Modal'
import { ProductPrice27x13Modal } from './ProductPrice27x13Modal'

interface Props {
    product: ProductEntity
}
const InventoryDetail = ({ product }: Props) => {
    const { openProductModal } = useProductUIStore();
    const { handleOpenRegisterLotModal } = useRegisterLotModal();
    const { handleRegisterOpenModalInventory } = useRegisterInventoryModal();
    const { handleOpenModalInventory } = useUpdateInventoryModal();
    const { handleOpenModalInventoryItem } = useRegisterInventoryItemModal();
    const { handleOpenModalUpdateInventoryItem } = useUpdateInventoryItemModal();
    const { handleOpenModalDeleteInventoryItem } = useDeleteInventoryItemModal();
    const { openLocalTransferInventoryItemModal } = useLocalTransferInventoryItemModal();
    return (
        <>
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <TbBoxMultiple className="w-5 h-5 text-blue-600" />
                    Inventario del producto
                </h2>
                <div className='flex gap-4'>
                    <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                        <Button color='yellow' onClick={() => handleOpenModalInventory(product?.inventory ?? null, product)}>
                            <HiPencil className="w-4 h-4" />
                            Editar inventario
                        </Button>
                        <Button onClick={() => handleOpenRegisterLotModal(product.productId.toString())}>
                            <HiPlus className="w-4 h-4" />
                            Agregar nuevo lote
                        </Button>
                    </HideElement>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                    {
                        !product.inventory && (
                            <Button color='blue' onClick={() => handleRegisterOpenModalInventory(product)}>
                                <HiPlus className="w-4 h-4" />
                                Agregar control de inventario
                            </Button>
                        )
                    }
                </HideElement>
            </div>
            {
                !product.inventory && (
                    <span className='text-gray-700 border border-gray-300 rounded-xl p-4 block mt-4'>
                        No se encontro inventario...
                    </span>
                )
            }
            <RegisterInventoryModal />
            {product.inventory && (
                <div className="space-y-4">
                    <UpdateInventoryModal product={product} />
                    <div key={product.inventory.inventoryId} className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 mt-4">
                            <div className={`bg-gray-50 border border-gray-200 rounded-lg p-2`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-600"> <HiOutlineQrcode /> </span>
                                    <Button
                                        size='sm'
                                        title='Imprimir código de barras'
                                        onClick={() => openProductModal('printLabels')}>
                                        27x13
                                        <ImPrinter />
                                    </Button>
                                    <Button
                                    color='yellow'
                                        size='sm'
                                        title='Imprimir código de barras'
                                        onClick={() => openProductModal('printLabels-51x25')}>
                                        51x25
                                        <ImPrinter />
                                    </Button>
                                    <Button
                                        color='purple'
                                        size='sm'
                                        title='Imprimir precios de mayoreo y menudeo'
                                        onClick={() => openProductModal('print-labels-prices-27x13')}>
                                        Precios
                                        <ImPrinter />
                                    </Button>
                                </div>
                                <ProductBarCodeModal inventoryId={product.inventory.inventoryId} />
                                <ProductBarCode51x25Modal inventoryId={product.inventory.inventoryId} />
                                <ProductPrice27x13Modal inventoryId={product.inventory.inventoryId} />
                                <div className="text-gray-900 font-semibold">
                                    <div className='printable-content'>
                                        <Barcode
                                            format='CODE128'
                                            value={product?.inventory.internalBarCode ?? ''}
                                            width={1}
                                            height={50}
                                            fontSize={16} />
                                    </div>

                                </div>
                            </div>
                            <InfoCard
                                label="Precio de menudeo"
                                value={`$${product?.inventory.salePriceOne}`}
                                icon={<TbCurrencyDollar className="w-4 h-4" />}
                                className="bg-white"
                            />
                            <InfoCard
                                label="Stock mínimo"
                                value={(product?.inventory.minStockBranch ?? 0).toString()}
                                icon={<TbBoxMultiple className="w-4 h-4" />}
                                className="bg-white"
                            />
                            <InfoCard
                                label="Stock máximo"
                                value={(product.inventory.maxStockBranch ?? 0).toString()}
                                icon={<TbBoxMultiple className="w-4 h-4" />}
                                className="bg-white"
                            />
                            <InfoCard
                                label="Unidades para mayoreo"
                                value={(product.inventory.saleQuantityMany ?? 0).toString()}
                                icon={<TbBoxMultiple className="w-4 h-4" />}
                                className="bg-white"
                            />
                            <InfoCard
                                label="Precio de mayoreo"
                                value={`$${product.inventory.salePriceMany}`}
                                icon={<TbCurrencyDollar className="w-4 h-4" />}
                                className="bg-white"
                            />
                        </div>

                        {/* Ubicación: Ventas */}
                        <RegisterInventoryItemModal />
                        <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-gray-700 flex items-center gap-2">
                                <HiOutlineLocationMarker className="w-5 h-5" />
                                Ubicación: Ventas
                            </h5>
                            <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                                <Button onClick={() => handleOpenModalInventoryItem(product.inventory?.inventoryId ?? null)}>
                                    <HiPlus className="w-4 h-4" /> Agregar ubicación
                                </Button>
                            </HideElement>
                        </div>
                        {product.inventory.inventoryItems && product.inventory.inventoryItems.length > 0 && (
                            <div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {product.inventory.inventoryItems.map((item) => (
                                        <>
                                            <UpdateInventoryItemModal />
                                            <DeleteInventoryItemModal />
                                            <LocalTransferInventoryItemModal />
                                            <div key={item.inventoryItemId} className="w-60 bg-white rounded-lg p-4 border border-gray-200">
                                                <div className="flex flex-col justify-center items-center mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                        <span className="text-2xl font-bold text-gray-800">{item.location.toUpperCase()}</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                                                            <Button color='red' title='Eliminar ubicación de stock' onClick={() => handleOpenModalDeleteInventoryItem(item.inventoryItemId)}>
                                                                <HiTrash className="w-3 h-3" />
                                                            </Button>
                                                            <Button color='yellow' title='Editar cantidad de stock' onClick={() => handleOpenModalUpdateInventoryItem(item)}>
                                                                <HiPencil className="w-3 h-3" />
                                                            </Button>
                                                            <Button color='green' title='Transfiere stock a otra ubicacion: Ej (Venta, Almacen, etc)' onClick={() => openLocalTransferInventoryItemModal(item)}>
                                                                <TbTransfer className="w-3 h-3" />
                                                            </Button>
                                                        </HideElement>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex flex-col justify-center items-center">
                                                        <span className="text-xl text-gray-600">Stock:</span>
                                                        <span className={`text-4xl font-medium`}>{item.quantityOnHan}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default InventoryDetail
