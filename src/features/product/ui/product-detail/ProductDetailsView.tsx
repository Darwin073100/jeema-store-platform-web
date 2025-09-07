'use client'
import { ProductEntity } from '../../domain/entities/product.entity';
import { formatDate } from '@/shared/lib/utils/date-formatter';
import Barcode from 'react-barcode';
import { InfoCard } from '@/ui/components/cards/InfoCard';
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiOutlineTag,
    HiOutlineQrcode,
    HiOutlineCube,
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineTicket
} from 'react-icons/hi';
import {
    TbPackage,
    TbBoxMultiple,
    TbBuildingWarehouse,
    TbCurrencyDollar,
} from 'react-icons/tb';
import { UpdateProductModal } from './UpdateProductModal';
import { useUpdateProductModal } from '../../hooks';
import { BreadcrumbItem, TemplateHeader } from '@/ui/components/templates/TemplateHeader';
import { UpdateLotModal } from '@/features/lot/ui/UpdateLotModal';
import { RegisterLotModal } from '@/features/lot/ui/RegisterLotModal';
import { useUpdateLotModal } from '@/features/lot/hooks/useUpdateLotModal';
import { useRegisterLotModal } from '@/features/lot/hooks/useRegisterLotModal';
import { useRegisterLotUnitPurchaseModal } from '@/features/lot/hooks/useRegisterLotUnitPurchaseModal';
import { Button } from '@/ui/components/buttons';
import { RegisterLotUnitPurchaseModal } from '@/features/lot/ui/RegisterLotUnitPurchaseModal';
import { useUpdateLotUnitPurchaseModal } from '@/features/lot/hooks/useUpdateLotUnitPurchaseModal';
import { LotUnitPurchaseEntity } from '@/features/lot/domain/entities/lot-unit-purchase.entity';
import { UpdateLotUnitPurchaseModal } from '@/features/lot/ui/UpdateLotUnitPurchaseModal';
import { useUpdateInventoryModal } from '@/features/inventory/hooks/useUpdateInventoryModal';
import { InventoryEntity } from '@/features/inventory/domain/entities/inventory.entity';
import { UpdateInventoryModal } from '@/features/inventory/ui/UpdateInventoryModal';
import { useRegisterInventoryItemModal } from '@/features/inventory/hooks/useRegisterInventoryItemModal';
import { RegisterInventoryItemModal } from '@/features/inventory/ui/RegisterInventoryItemModal';
import { useUpdateInventoryItemModal } from '@/features/inventory/hooks/useUpdateInventoryItemModal';
import { InventoryItemEntity } from '@/features/inventory/domain/entities/inventory-item-response.dto';
import { UpdateInventoryItemModal } from '@/features/inventory/ui/UpdateInventoryItemModal';
import { DeleteInventoryItemModal } from '@/features/inventory/ui/DeleteInventoryItemModal';
import { useDeleteInventoryItemModal } from '@/features/inventory/hooks/useDeleteInventoryItemModal';
import { DeleteLotUnitPurchaseModal } from '@/features/lot/ui/DeleteLotUnitPurchaseModal';
import { useDeleteLotUnitPurchaseModal } from '@/features/lot/hooks/useDeleteLotUnitPurchaseModal';
import { DeleteLotModal } from '@/features/lot/ui/DeleteLotModal';
import { useDeleteLotModal } from '@/features/lot/hooks/useDeleteLotModal';
import { useDeleteProductModal } from '../../hooks/useDeleteProductModal';
import { DeleteProductModal } from './DeleteProductModal';
import { useRegisterInventoryModal } from '@/features/inventory/hooks/useRegisterInventoryModal';
import { RegisterInventoryModal } from '@/features/inventory/ui/RegisterInventoryModal';
import { ImPrinter } from 'react-icons/im';

interface Props {
    product: ProductEntity;
}

export function ProductDetailsView({ product }: Props) {
    const { handleOpenUpdateProductModal } = useUpdateProductModal();
    const { handleOpenUpdateLotModal } = useUpdateLotModal();
    const { handleOpenRegisterLotModal } = useRegisterLotModal();
    const { handleSelectedLotUnitPurchase: handleSelectedLotId } = useRegisterLotUnitPurchaseModal();
    const { handleSelectedLotUnitPurchase } = useUpdateLotUnitPurchaseModal();
    const { handleRegisterOpenModalInventory } = useRegisterInventoryModal();
    const { handleOpenModalInventory } = useUpdateInventoryModal();
    const { handleOpenModalInventoryItem } = useRegisterInventoryItemModal();
    const { handleOpenModalUpdateInventoryItem } = useUpdateInventoryItemModal();
    const { handleOpenModalDeleteInventoryItem } = useDeleteInventoryItemModal();
    const { handleOpenModalDeleteLotUnitPurchase } = useDeleteLotUnitPurchaseModal();
    const { handleOpenModalDeleteLot } = useDeleteLotModal();
    const { handleOpenModalDeleteProduct } = useDeleteProductModal();


    const handlePrint = () => {
        window.print();
    };

    const handleAddLot = () => {
        handleOpenRegisterLotModal(product.productId.toString());
    };

    const handleAddLotUnitPurchase = (lotId: bigint) => {
        // Agregar lot-unit-purchase para lote
        handleSelectedLotId(lotId);
    };

    const handleUpdateLotUnitPurchase = (lotUnitPurchase: LotUnitPurchaseEntity) => {
        handleSelectedLotUnitPurchase(lotUnitPurchase);
    }

    // const handleAddInventory = (branchOfficeId: bigint, productId: bigint, lotId: bigint ) => {
    //     console.log({branchOfficeId,productId,lotId});
    //     handleOpenModalInventory(branchOfficeId, productId, lotId);
    //     // Agregar inventario para lote
    // };
    const handleAddInventory = (selectedInventory: InventoryEntity, selectProd: ProductEntity) => {
        handleOpenModalInventory(selectedInventory, selectProd);
        // Agregar inventario para lote
    };

    const handleAddInventoryItem = (inventoryId: bigint) => {
        handleOpenModalInventoryItem(inventoryId);
        // Agregar item de inventario para inventario
    };

    const handlerSelectedInventoryItemModal = (inventoryItem: InventoryItemEntity)=> {
        handleOpenModalUpdateInventoryItem(inventoryItem);
    }

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Productos', href: '/products' },
        { label: product.name }
    ];

    return (
        <TemplateHeader title={product.name} detail='Detalles del producto' breadcrumbItems={breadcrumbItems}>
            <div className="flex gap-2">
                <Button color='yellow' onClick={() => handleOpenUpdateProductModal(product)}>
                    <HiPencil className="w-4 h-4" />
                    Modificar
                </Button>
                <Button color='red' onClick={()=> handleOpenModalDeleteProduct(product)}>
                    <HiTrash className="w-4 h-4" />
                    Eliminar
                </Button>
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
                                <span className="text-gray-600"> <HiOutlineQrcode/> </span>
                                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    Código de barra universal
                                </label>
                            </div>
                            <div className="text-gray-900 font-semibold">
                                <Barcode 
                                    value={product.universalBarCode?? ''} 
                                    width={1} 
                                    height={50} 
                                    fontSize={16} />
                            </div>
                        </div>
                        {/* <InfoCard
                            label="SKU"
                            value={product.sku || 'No asignado'}
                            icon={<HiOutlineTag className="w-4 h-4" />}
                        /> */}
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

            {/* Lote del producto */}
            <RegisterLotModal />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <TbBoxMultiple className="w-5 h-5 text-blue-600" />
                        Lote del producto
                    </h2>
                    <Button onClick={handleAddLot}>
                        <HiPlus className="w-4 h-4" />
                        Agregar nuevo lote
                    </Button>
                </div>

                {product.lots && product.lots.length > 0 ? (
                    <>
                        <UpdateLotModal />
                        <DeleteLotModal />
                        <div className="p-6 space-y-6">
                            {product.lots.map((lot, index) => (
                                <div key={lot.lotId} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                                {index + 1}
                                            </span>
                                            Lote #{lot.lotNumber}
                                        </h3>
                                        <div className="flex gap-2">
                                            <Button color='yellow' onClick={() => handleOpenUpdateLotModal(lot)}>
                                                <HiPencil className="w-4 h-4" /> Modificar
                                            </Button>
                                            <Button color='red' onClick={()=> handleOpenModalDeleteLot(lot.lotId)}>
                                                <HiTrash className="w-4 h-4" /> Eliminar
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <InfoCard
                                            label="Unidad báse"
                                            value={`${lot.purchaseUnit.toUpperCase()}`}
                                            icon={<TbPackage className="w-4 h-4" />}
                                        />
                                        <InfoCard
                                            label="Precio de compra"
                                            value={`$${lot.purchasePrice}`}
                                            icon={<TbCurrencyDollar className="w-4 h-4" />}
                                        />
                                        <InfoCard
                                            label="Cantidad comprada"
                                            value={lot.initialQuantity.toString()}
                                            icon={<TbBoxMultiple className="w-4 h-4" />}
                                        />
                                        <InfoCard
                                            label="Fecha de ingreso"
                                            value={formatDate(lot.receivedDate)}
                                            icon={<HiOutlineCalendar className="w-4 h-4" />}
                                        />
                                        <InfoCard
                                            label="Fecha de fabricación"
                                            value={lot.manufacturingDate ? formatDate(lot.manufacturingDate) : 'No especificada'}
                                            icon={<HiOutlineCalendar className="w-4 h-4" />}
                                        />
                                        <InfoCard
                                            label="Fecha de caducidad"
                                            value={lot.expirationDate ? formatDate(lot.expirationDate) : 'No especificada'}
                                            icon={<HiOutlineCalendar className="w-4 h-4" />}
                                        />
                                    </div>

                                    {/* Unidades de compra */}
                                        <RegisterLotUnitPurchaseModal />
                                        <div className="flex items-center mb-3 gap-4">
                                            <h4 className="font-medium text-gray-700">Unidades de compra</h4>
                                            <Button color='blue' type='button' onClick={() => handleAddLotUnitPurchase(lot.lotId)}>
                                                <HiPlus className="w-4 h-4" /> Agregar unidad
                                            </Button>
                                        </div>
                                    {lot.lotUnitPurchases && lot.lotUnitPurchases.length > 0 && (
                                        <div className="mb-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                    <UpdateLotUnitPurchaseModal />
                                                    <DeleteLotUnitPurchaseModal />
                                                    {lot.lotUnitPurchases.map((unitPurchase) => (
                                                        <div key={unitPurchase.lotUnitPurchaseId} className="border border-gray-300 rounded-2xl p-4 space-y-2">
                                                            <div className='flex justify-between gap-2'>
                                                                <Button color='yellow' onClick={() => handleUpdateLotUnitPurchase(unitPurchase)}>
                                                                    <HiPencil className="w-4 h-4" />
                                                                    Modificar
                                                                </Button>
                                                                <Button color='red' onClick={() => handleOpenModalDeleteLotUnitPurchase(lot.lotId, unitPurchase.lotUnitPurchaseId)}>
                                                                    <HiTrash className="w-4 h-4" />
                                                                    Eliminar
                                                                </Button>
                                                            </div>
                                                            <InfoCard
                                                                label="Unidad"
                                                                value={unitPurchase.unit}
                                                                className="bg-white"
                                                            />
                                                            <InfoCard
                                                                label="Cantidad comprada"
                                                                value={unitPurchase.purchaseQuantity.toString()}
                                                                className="bg-white"
                                                            />
                                                            <InfoCard
                                                                label="Costo de la unidad"
                                                                value={`$${unitPurchase.purchasePrice}`}
                                                                className="bg-white"
                                                            />
                                                            <InfoCard
                                                                label="Unidades base en esta unidad"
                                                                value={unitPurchase.unitsInPurchaseUnit.toString()}
                                                                className="bg-white"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Inventario */}
                                    {/* <RegisterInventoryModal /> */}
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                            <TbBuildingWarehouse className="w-5 h-5" />
                                            Inventario
                                        </h4>
                                        {
                                            lot.inventories && lot.inventories.length < 1 && (
                                                <Button color='blue' onClick={()=> handleRegisterOpenModalInventory(lot.lotId, product)}>
                                                    <HiPlus className="w-4 h-4" />
                                                    Agregar control de inventario
                                                </Button>
                                            )
                                        }
                                    </div>
                                    {
                                        lot.inventories && lot.inventories.length < 1 && (
                                            <span className='text-gray-700 border border-gray-300 rounded-xl p-4 block mt-4'>
                                                No se encontro inventario...
                                            </span>
                                        )
                                    }
                                    <RegisterInventoryModal/>
                                    {lot.inventories && lot.inventories.length > 0 && (
                                        <div className="space-y-4">
                                            <UpdateInventoryModal product={product} />
                                            {lot.inventories.map((inventory) => (
                                                <div key={inventory.inventoryId} className="bg-gray-50 rounded-lg p-4">
                                                <Button color='yellow' onClick={() => handleAddInventory(inventory, product)}>
                                                    <HiPencil className="w-4 h-4" />
                                                    Modificar
                                                </Button>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 mt-4">
                                                        <div className={`bg-gray-50 border border-gray-200 rounded-lg p-2`}>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-gray-600"> <HiOutlineQrcode/> </span>
                                                                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                                                    Código de barra interno
                                                                </label>
                                                                <Button 
                                                                    title='Imprimir código de barras' 
                                                                    onClick={()=> handlePrint()}>
                                                                    <ImPrinter />
                                                                </Button>
                                                            </div>
                                                            <div className="text-gray-900 font-semibold">
                                                                <div className='printable-content'>
                                                                    <Barcode 
                                                                        value={inventory.internalBarCode?? ''} 
                                                                        width={1} 
                                                                        height={50} 
                                                                        fontSize={16}/>
                                                                </div>
                                                                    
                                                            </div>
                                                        </div>
                                                        <InfoCard
                                                            label="Precio de menudeo"
                                                            value={`$${inventory.salePriceOne}`}
                                                            icon={<TbCurrencyDollar className="w-4 h-4" />}
                                                            className="bg-white"
                                                        />
                                                        <InfoCard
                                                            label="Stock mínimo"
                                                            value={(inventory.minStockBranch ?? 0).toString()}
                                                            icon={<TbBoxMultiple className="w-4 h-4" />}
                                                            className="bg-white"
                                                        />
                                                        <InfoCard
                                                            label="Stock máximo"
                                                            value={(inventory.maxStockBranch ?? 0).toString()}
                                                            icon={<TbBoxMultiple className="w-4 h-4" />}
                                                            className="bg-white"
                                                        />
                                                        <InfoCard
                                                            label="Unidades para mayoreo"
                                                            value={(inventory.saleQuantityMany ?? 0).toString()}
                                                            icon={<TbBoxMultiple className="w-4 h-4" />}
                                                            className="bg-white"
                                                        />
                                                        <InfoCard
                                                            label="Precio de mayoreo"
                                                            value={`$${inventory.salePriceMany}`}
                                                            icon={<TbCurrencyDollar className="w-4 h-4" />}
                                                            className="bg-white"
                                                        />
                                                    </div>

                                                    {/* Ubicación: Ventas */}
                                                    <RegisterInventoryItemModal/>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h5 className="font-medium text-gray-700 flex items-center gap-2">
                                                            <HiOutlineLocationMarker className="w-5 h-5" />
                                                            Ubicación: Ventas
                                                        </h5>
                                                        <Button onClick={() => handleAddInventoryItem(inventory.inventoryId)}>
                                                            <HiPlus className="w-4 h-4" /> Agregar ubicación
                                                        </Button>
                                                    </div>
                                                    {inventory.inventoryItems && inventory.inventoryItems.length > 0 && (
                                                        <div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {inventory.inventoryItems.map((item) => (
                                                                <>
                                                                    <UpdateInventoryItemModal/>
                                                                    <DeleteInventoryItemModal/>
                                                                    <div key={item.inventoryItemId} className="w-60 bg-white rounded-lg p-4 border border-gray-200">
                                                                        <div className="flex flex-col justify-center items-center mb-3">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                                                <span className="text-2xl font-bold text-gray-800">{item.location.toUpperCase()}</span>
                                                                            </div>
                                                                            <div className="flex gap-1">
                                                                                <Button color='yellow' onClick={()=> handlerSelectedInventoryItemModal(item)}>
                                                                                    <HiPencil className="w-3 h-3" /> Modificar
                                                                                </Button>
                                                                                <Button color='red' onClick={()=> handleOpenModalDeleteInventoryItem(item.inventoryItemId)}>
                                                                                    <HiTrash className="w-3 h-3"  /> Eliminar
                                                                                </Button>
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
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="p-6">
                        <div className="text-center py-12">
                            <TbBoxMultiple className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">No hay lotes registrados para este producto</p>
                            <p className="text-gray-500 text-sm mt-1">Agrega un lote para comenzar a gestionar el inventario</p>
                        </div>
                    </div>
                )}
            </div>
        </TemplateHeader>
    );
}