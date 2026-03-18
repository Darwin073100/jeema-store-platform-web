'use client'
import { useBrandStore } from '@/contexts/product-management/brand/presentation/stores/brand.store';
import { useCategoryStore } from '@/contexts/product-management/category/presentation/stores/category.store';
import { useSeasonStore } from '@/contexts/product-management/season/presentation/stores/season.store';
import { Button } from '@/shared/ui/components/buttons';
import { SelectMenu, SelectMenuOption, TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import React, { useEffect } from 'react'
import { TbExchange } from 'react-icons/tb';
import { FloatMessage } from '@/shared/ui/components/messages';
import { HiSave } from 'react-icons/hi';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { LocationEnum } from '@/features/inventory/domain/enums/location.enum';
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton';
import { ProductEnableOptios } from './ProductEnableOptios';
import { useRegisterCompleteProduct } from '../../hooks/useRegisterCompleteProduct';
import { AiFillProduct } from 'react-icons/ai';
import { BiBarcode, BiSolidPurchaseTag } from "react-icons/bi";
import { MdInventory2 } from 'react-icons/md';
import { SuplierEntity } from '@/features/suplier/domain/entities/suplier.entity';
import { useProductUIStore } from '../../stores/product-ui.store';
import { ICategory } from '@/contexts/product-management/category/presentation/interfaces/ICategory';
import { IBrand } from '@/contexts/product-management/brand/presentation/interfaces/Ibrand';
import { ISeason } from '@/contexts/product-management/season/presentation/interfaces/ISeason';
import { forSaleObject } from '../../../domain/enums/for-sale.object';

interface Props {
    categoryList: ICategory[],
    brandList: IBrand[],
    seasonList: ISeason[],
    suplierList: SuplierEntity[],
}

const FormRegisterCompleteProduct = ({ categoryList, brandList, seasonList, suplierList }: Props) => {
    const {
        errors, floatMessageState, handleSubmit, isLoading, addLotUnitPurchase, removeLotUnitPurchase,
        onSubmit, register, handleBarCodeMatch, handleStockGlobalToBranch, updateLotUnitPurchase, lotUnitPurchases,
        addInventoryItem, removeInventoryItem, updateInventoryItem, inventoryItems, handleInitialQuantityToquantityOnHand,
        inventoryCheck, lotCheck, handleGenerateBarcode,
    } = useRegisterCompleteProduct();
    const { categories, setCategories } = useCategoryStore();
    const { seasons, setSeasons } = useSeasonStore();
    const { brands, setBrands } = useBrandStore();
    const { loading } = useProductUIStore();

    useEffect(() => {
        setCategories(categoryList);
        setBrands(brandList);
        setSeasons(seasonList);
    }, []);

    const categoryOptions = categories.map(item => ({
        value: item.categoryId.toString(),
        text: item.name
    }));
    const brandOptions = brands.map(item => ({
        value: item.brandId.toString(),
        text: item.name
    }));
    const seasonOptions = seasons.map(item => ({
        value: item.seasonId.toString(),
        text: item.name
    }));
    const locationOptions = Object.values(LocationEnum).map(item => ({
        value: item.toString(),
        text: item.toString()
    }));
    const suplierOptions: SelectMenuOption[] = suplierList.map(item => ({
        text: item.name, 
        value: item.suplierId.toString()
    }));

    return (
            <div className="max-w-full mx-auto p-4 lg:p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
                    <ProductEnableOptios 
                        register={register} />
                    
                    {/* Sección Principal del Producto */}
                    <div className="">
                        <div className="rounded-2xl mb-4 bg-gradient-to-r from-blue-600 to-blue-700 px-4 lg:px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <AiFillProduct />
                                <span className='ml-4'>Información del Producto</span>
                            </h2>
                        </div>
                        <div className="p-4 lg:p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
                                    <LabelInput 
                                        required='yes' 
                                        value="Nombre del producto"
                                        description='Ingresa el nombre comercial completo del producto, incluyendo marca y características principales. Ej: Lápiz Bocetto Neón Color Azul.' />
                                    <TextInput
                                        {...register('name')}
                                        error={!!errors.name}
                                        errorMessage={errors.name?.message}
                                        placeholder="Ingresa el nombre del producto"
                                    />
                                </div>
                                
                                <div>
                                    <div className='flex gap-2'>
                                        <LabelInput
                                            required='yes' 
                                            value="C. de barras universal"
                                            description='Ingresa el código de barras EAN/UPC que viene impreso en el producto. Este código es único para cada producto. Ej: 7501234567890.' />
                                        <Button color='purple' size='sm' type='button' onClick={()=> handleGenerateBarcode()}>{loading==='generateBarcode'? <Spinner size={12}/> : <BiBarcode/>}Generar</Button>
                                    </div>
                                    <TextInput
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                            e.preventDefault(); // ⛔ evita el submit del formulario
                                            }
                                        }}
                                        {...register('universalBarCode')}
                                        error={!!errors.universalBarCode}
                                        errorMessage={errors.universalBarCode?.message}
                                        placeholder="Ej: 123456789012"
                                    />
                                </div>
                                
                                <div>
                                    <LabelInput 
                                        required='yes' 
                                        value="Stock Mínimo Global"
                                        description='Cantidad mínima que debe mantener el establecimiento para abastecer a todas las sucursales. Cuando el stock baje de este número, se generará una alerta. Ej: 50' />
                                    <TextInput
                                        {...register('minStockGlobal',{ valueAsNumber: true })}
                                        step='0.001'
                                        error={!!errors.minStockGlobal}
                                        errorMessage={errors.minStockGlobal?.message}
                                        type='number'
                                        placeholder="Ej: 10"
                                    />
                                </div>
                                
                                <div>
                                    <LabelInput 
                                        required='yes' 
                                        value="Categoría" 
                                        htmlFor='category'
                                        description='Selecciona la categoría que mejor describe el tipo de producto. Esto ayuda a organizar el inventario y facilita las búsquedas. Ej: Papelería, Electrónicos, Alimentos.' />
                                    <SelectMenu id='category'
                                        {...register('categoryId')}
                                        error={!!errors.categoryId}
                                        errorMessage={errors.categoryId?.message}
                                        items={categoryOptions}
                                    />
                                </div>
                                
                                <div>
                                    <LabelInput 
                                        required='yes' 
                                        value="Marca" 
                                        htmlFor='brand'
                                        description='Selecciona la marca del fabricante del producto. Esto permite agrupar productos del mismo fabricante y facilita el control de inventario. Ej: Bocetto, Faber-Castell.' />
                                    <SelectMenu id='brand'
                                        {...register('brandId')}
                                        error={!!errors.brandId}
                                        errorMessage={errors.brandId?.message}
                                        items={brandOptions}
                                    />
                                </div>
                                
                                <div>
                                    <LabelInput 
                                        required='yes' 
                                        value="Temporada" 
                                        htmlFor='season'
                                        description='Indica la temporada o período del año en que este producto tiene mayor demanda. Esto ayuda a planificar el inventario. Ej: Todo el año, Escolar, Navidad, Verano.' />
                                    <SelectMenu id='season'
                                        {...register('seasonId')}
                                        error={!!errors.seasonId}
                                        errorMessage={errors.seasonId?.message}
                                        items={seasonOptions}
                                    />
                                </div>
                                
                                <div>
                                    <LabelInput 
                                        required='yes' 
                                        value="Unidad de medida para ventas" 
                                        htmlFor='unitOfMeasure'
                                        description='Selecciona cómo se venderá el producto: por pieza (PC), kilogramo (KG), litro (L), metro (M), docena (DOC), paquete (PAQ), caja (CAJA) o set (SET). Esta será la unidad base para las ventas.' />
                                    <SelectMenu id='unitOfMeasure'
                                        {...register('unitOfMeasure')}
                                        error={!!errors.unitOfMeasure}
                                        errorMessage={errors.unitOfMeasure?.message}
                                        items={forSaleObject}
                                    />
                                </div>
                                
                                <div className="md:col-span-2 xl:col-span-2">
                                    <LabelInput 
                                        value="Descripción del producto" 
                                        required='no'
                                        description='Añade detalles específicos como color, tamaño, material, especificaciones técnicas u otras características que ayuden a identificar y diferenciar el producto.' />
                                    <TextInput
                                        {...register('description')}
                                        error={!!errors.description}
                                        errorMessage={errors.description?.message}
                                        placeholder="Describe del producto."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {lotCheck &&  <div className="">
                        <div className="rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 px-4 lg:px-6 py-4 my-4">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <BiSolidPurchaseTag />
                                <span className='ml-4'>Información del Lote</span>
                            </h2>
                        </div>
                        <div className=" rounded-2xl bg-gradient-to-r from-gray-50 to-gray-50 border-l border-r border-b border-gray-200 p-4 lg:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                <div className="md:col-span-1">
                                    <LabelInput 
                                        value="Proveedor"
                                        description="Selecciona el proveedor al que compraste la mercancia."
                                        required='no' />
                                    <SelectMenu
                                        items={suplierOptions}
                                        error={!!errors.suplierId}
                                        errorMessage={errors.suplierId?.message}
                                        {...register('suplierId')}
                                    />
                                </div>
                                <div>
                                    <LabelInput 
                                        required='yes' 
                                        value="Unidad base" 
                                        htmlFor='purchaseUnit'
                                        description='Selecciona la unidad en la que compras el producto. Es importante que coincida con la unidad de venta para mantener un control preciso del inventario.' />
                                    <SelectMenu id='purchaseUnit'
                                        {...register('purchaseUnit')}
                                        error={!!errors.purchaseUnit}
                                        errorMessage={errors.purchaseUnit?.message}
                                        items={forSaleObject}
                                    />
                                </div>
                                
                                <div>
                                    <LabelInput 
                                        value="Precio de compra" 
                                        required='yes'
                                        description='Ingresa el costo de adquisición por unidad base. Este valor se usará para calcular márgenes de ganancia y reportes financieros.' />
                                    <TextInput
                                        type='number'
                                        step="0.01"
                                        placeholder="0.00"
                                        error={!!errors.purchasePrice}
                                        errorMessage={errors.purchasePrice?.message}
                                        {...register('purchasePrice', { valueAsNumber: true })}
                                    />
                                </div>
                                
                                <div>
                                    <LabelInput 
                                        required='yes' 
                                        value="Stock comprado"
                                        description='Ingresa la cantidad total de unidades adquiridas en esta compra. Este será el inventario inicial del producto.' />
                                    <TextInput
                                        {...register('initialQuantity')}
                                        step='0.001'
                                        error={!!errors.initialQuantity}
                                        errorMessage={errors.initialQuantity?.message}
                                        type='number'
                                        placeholder="Stock comprado"
                                    />
                                </div>
                                
                                <div>
                                    <LabelInput 
                                        required='yes' 
                                        value="Fecha de ingreso al establecimiento"
                                        description='Fecha en que el producto fue recibido en el almacén. Se usa para el control de inventario y reportes de compras.' />
                                    <TextInput
                                        {...register('receivedDate')}
                                        error={!!errors.receivedDate}
                                        errorMessage={errors.receivedDate?.message}
                                        type='date'
                                    />
                                </div>
                                
                                <div>
                                    <LabelInput 
                                        value="Fecha de fabricación" 
                                        required='no'
                                        description='Fecha en que el producto fue fabricado. Importante para productos con vida útil limitada o para control de calidad.' />
                                    <TextInput
                                        {...register('manufacturingDate')}
                                        error={!!errors.manufacturingDate}
                                        errorMessage={errors.manufacturingDate?.message}
                                        type='date'
                                    />
                                </div>
                                
                                <div>
                                    <LabelInput 
                                        value="Fecha de caducidad" 
                                        required='no'
                                        description='Fecha límite para la venta o uso del producto. Necesario para productos perecederos o con fecha de vencimiento.' />
                                    <TextInput
                                        {...register('expirationDate')}
                                        error={!!errors.expirationDate}
                                        errorMessage={errors.expirationDate?.message}
                                        type='date'
                                    />
                                </div>
                            </div>

                            {/* Sección de Costos por Unidades */}
                            <div className="mt-6 xl:col-span-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Costos por Unidades</h3>
                                    <Button
                                        type='button'
                                        color='blue'
                                        size="sm"
                                        onClick={addLotUnitPurchase}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-lg">+</span>
                                        Agregar unidad de compra
                                    </Button>
                                </div>
                                
                                {/* Mostrar error general del array si existe */}
                                {errors.lotUnitPurchases && typeof errors.lotUnitPurchases.message === 'string' && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{errors.lotUnitPurchases.message}</p>
                                    </div>
                                )}
                                
                                <div className="space-y-4">
                                    {lotUnitPurchases.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-500">
                                                    Unidad de compra #{index + 1}
                                                </span>
                                                    <RoundedButton
                                                        type="button"
                                                        color='red'
                                                        onClick={() => removeLotUnitPurchase(index)}
                                                        title="Eliminar unidad de compra"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </RoundedButton>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <LabelInput 
                                                        value="Unidad" 
                                                        required='yes'
                                                        description='Selecciona la unidad de compra alternativa (caja, paquete, etc.) para gestionar el producto en diferentes presentaciones.' />
                                                    <SelectMenu
                                                        items={forSaleObject}
                                                        value={item.unit}
                                                        onChange={(e) =>
                                                            updateLotUnitPurchase(index, "unit", e.target.value)
                                                        }
                                                        error={!!(errors.lotUnitPurchases?.[index]?.unit)}
                                                        errorMessage={errors.lotUnitPurchases?.[index]?.unit?.message}
                                                    />
                                                </div>
                                                <div>
                                                    <LabelInput 
                                                        value="Unidades base en esta unidad" 
                                                        required='yes'
                                                        description='Indica cuántas unidades base (piezas, kg, etc.) contiene esta presentación. Ej: Una caja con 12 piezas = 12.' />
                                                    <TextInput
                                                        type="number"
                                                        value={item.unitsInPurchaseUnit}
                                                        onChange={(e) =>
                                                            updateLotUnitPurchase(index, "unitsInPurchaseUnit", Number(e.target.value))
                                                        }
                                                        error={!!(errors.lotUnitPurchases?.[index]?.unitsInPurchaseUnit)}
                                                        errorMessage={errors.lotUnitPurchases?.[index]?.unitsInPurchaseUnit?.message}
                                                        placeholder="0"
                                                        step='0.001'
                                                    />
                                                </div>
                                                <div>
                                                    <LabelInput 
                                                        value="Cantidad comprada de esta unidad" 
                                                        required='yes'
                                                        description='Ingresa cuántas unidades de esta presentación fueron compradas. Ej: Si compraste 5 cajas de 12 piezas = 5.' />
                                                    <TextInput
                                                        type="number"
                                                        value={item.purchaseQuantity}
                                                        onChange={(e) =>
                                                            updateLotUnitPurchase(index, "purchaseQuantity", Number(e.target.value))
                                                        }
                                                        error={!!(errors.lotUnitPurchases?.[index]?.purchaseQuantity)}
                                                        errorMessage={errors.lotUnitPurchases?.[index]?.purchaseQuantity?.message}
                                                        placeholder="0"
                                                        step='0.001'
                                                    />
                                                </div>
                                                <div>
                                                    <LabelInput 
                                                        value="Precio de compra de esta unidad" 
                                                        required='yes'
                                                        description='Ingresa el precio de compra por esta presentación. Ej: Si una caja cuesta $100, ingresa 100.' />
                                                    <TextInput
                                                        type="number"
                                                        value={item.purchasePrice}
                                                        onChange={(e) =>
                                                            updateLotUnitPurchase(index, "purchasePrice", Number(e.target.value))
                                                        }
                                                        error={!!(errors.lotUnitPurchases?.[index]?.purchasePrice)}
                                                        errorMessage={errors.lotUnitPurchases?.[index]?.purchasePrice?.message}
                                                        placeholder="0.00"
                                                        step='0.01'
                                                    />
                                                </div>



                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div> }
                   
                    {/* Sección de Inventario del Producto */}
                    {inventoryCheck && <div className="">
                        <div className="rounded-2xl my-4 bg-gradient-to-r from-blue-600 to-blue-700 px-4 lg:px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <MdInventory2 />
                                <span className='ml-4'>Inventario del Producto</span>
                            </h2>
                        </div>
                        <div className="rounded-2xl p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200">
                            {/* Sección de Ubicaciones del Inventario */}
                            <div className="mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                                    <h3 className="text-lg font-medium text-gray-900">Ubicaciones del Inventario</h3>
                                    <Button
                                        type='button'
                                        color='blue'
                                        size="sm"
                                        onClick={addInventoryItem}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-lg">+</span>
                                        Agregar ubicación
                                    </Button>
                                </div>
                                
                                {/* Mostrar error general del array si existe */}
                                {errors.inventoryItems && typeof errors.inventoryItems.message === 'string' && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{errors.inventoryItems.message}</p>
                                    </div>
                                )}
                                
                                <div className="space-y-4">
                                    {inventoryItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-500">
                                                    Ubicación #{index + 1}
                                                </span>
                                                {inventoryItems.length > 1 && (
                                                    <RoundedButton
                                                        color='red'
                                                        type="button"
                                                        onClick={() => removeInventoryItem(index)}
                                                        title="Eliminar ubicación"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </RoundedButton>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                                <div>
                                                    <LabelInput 
                                                        value="Ubicación" 
                                                        required='yes'
                                                        description='Selecciona dónde se almacenará el producto (almacén, mostrador, bodega, etc.). Esto ayuda a localizar el producto rápidamente.' />
                                                    <SelectMenu
                                                        items={locationOptions}
                                                        value={item.location}
                                                        onChange={(e) =>
                                                            updateInventoryItem(index, "location", e.target.value)
                                                        }
                                                        error={!!(errors.inventoryItems?.[index]?.location)}
                                                        errorMessage={errors.inventoryItems?.[index]?.location?.message}
                                                    />
                                                </div>

                                                <div>
                                                    <div className='flex gap-4'>
                                                        <LabelInput 
                                                            value="Cantidad de stock en esta ubicación" 
                                                            required='yes'
                                                            description='Ingresa cuántas unidades base se almacenarán en esta ubicación. Puedes usar el botón para asignar automáticamente el stock disponible.' />
                                                        <Button 
                                                            type='button' 
                                                            size="sm" 
                                                            color="yellow" 
                                                            onClick={() => handleInitialQuantityToquantityOnHand(inventoryItems.indexOf(item))}
                                                            className="whitespace-nowrap"
                                                        >
                                                            <TbExchange className="w-4 h-4" />
                                                            Usar stock comprado disponible
                                                        </Button>
                                                    </div>
                                                    <TextInput
                                                        type="number"
                                                        value={item.quantityOnHand}
                                                        onChange={(e) =>
                                                            updateInventoryItem(index, "quantityOnHand", Number(e.target.value))
                                                        }
                                                        error={!!(errors.inventoryItems?.[index]?.quantityOnHand)}
                                                        errorMessage={errors.inventoryItems?.[index]?.quantityOnHand?.message}
                                                        placeholder="0.000"
                                                        step='0.001'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sección de Precios de Venta */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-medium text-blue-800 mb-3">💰 Precio de Menudeo</h4>
                                    <LabelInput 
                                        value="Precio de venta por menudeo" 
                                        required='yes'
                                        description='Precio de venta al público por unidad base. Este es el precio regular para ventas individuales o en pequeñas cantidades.' />
                                    <TextInput
                                        {...register('salePriceOne')}
                                        error={!!errors.salePriceOne}
                                        errorMessage={errors.salePriceOne?.message}
                                        type='number'
                                        placeholder="0.00"
                                        step='0.01'
                                    />
                                </div>
                                
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                    <h4 className="font-medium text-green-800 mb-3">📦 Precio de Mayoreo</h4>
                                    <LabelInput 
                                        value="Precio de venta por mayoreo" 
                                        required='no'
                                        description='Precio especial por unidad cuando se compra en grandes cantidades. Este precio se aplicará cuando la compra supere la cantidad para mayoreo.' />
                                    <TextInput
                                        {...register('salePriceMany')}
                                        error={!!errors.salePriceMany}
                                        errorMessage={errors.salePriceMany?.message}
                                        type='number'
                                        placeholder="0.00"
                                        step='0.01'
                                    />
                                    <div className="mt-3">
                                        <LabelInput 
                                            value="Cantidad para mayoreo" 
                                            required='no'
                                            description='Cantidad mínima de unidades que el cliente debe comprar para acceder al precio de mayoreo.' />
                                        <TextInput
                                            {...register('saleQuantityMany')}
                                            error={!!errors.saleQuantityMany}
                                            errorMessage={errors.saleQuantityMany?.message}
                                            type="number"
                                            placeholder="Cantidad por mayoreo"
                                            step='0.01'
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sección de Stocks */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                                    <h4 className="font-medium text-orange-800 mb-3">📉 Stock Mínimo en Sucursal</h4>
                                    <div className='flex gap-4'>
                                        <LabelInput 
                                            value="Stock mínimo en sucursal" 
                                            required='yes'
                                            description='Cantidad mínima que debe mantener cada sucursal. Cuando el stock baje de este número, se generará una alerta para reabastecimiento.' />
                                        <Button 
                                            type='button' 
                                            size="sm" 
                                            color="yellow" 
                                            onClick={() => handleStockGlobalToBranch()}
                                            className="whitespace-nowrap"
                                        >
                                            <TbExchange className="w-4 h-4" />
                                            Usar stock global
                                        </Button>
                                    </div>
                                    <TextInput
                                        {...register('minStockBranch')}
                                        error={!!errors.minStockBranch}
                                        errorMessage={errors.minStockBranch?.message}
                                        placeholder="Cantidad mínima"
                                        type='number'
                                        step='0.001'
                                    />
                                </div>
                                
                                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                                    <h4 className="font-medium text-indigo-800 mb-3">📈 Stock Máximo en Sucursal</h4>
                                    <LabelInput 
                                        value="Stock máximo en sucursal" 
                                        required='yes'
                                        description='Cantidad máxima que debe mantener cada sucursal. Ayuda a optimizar el espacio y evitar exceso de inventario.' />
                                    <TextInput
                                        {...register('maxStockBranch')}
                                        error={!!errors.maxStockBranch}
                                        errorMessage={errors.maxStockBranch?.message}
                                        type='number'
                                        placeholder="Cantidad máxima"
                                        step='0.001'
                                        />
                                </div>
                                <div className='bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200'>
                                    <div className="flex flex-col">
                                            <h4 className="font-medium text-indigo-800 mb-3">𝄃𝄃𝄂𝄂𝄀 Código de barra interno</h4>
                                        <div className='flex gap-4'>
                                            <LabelInput 
                                                value="C. de barras int." 
                                                required='yes'
                                                description='Código de barras interno el usuario tendra que aisgnar uno o utilizar el universal. Se usa cuando el producto no tiene código de barras universal o se necesita un identificador adicional.' />
                                            <Button 
                                                type='button' 
                                                size="sm" 
                                                color="yellow" 
                                                onClick={() => handleBarCodeMatch()}
                                                className="whitespace-nowrap"
                                            >
                                                <TbExchange className="w-4 h-4" />
                                                Usar código universal
                                            </Button>
                                        </div>
                                        <div className="flex flex-col">
                                            <TextInput
                                            {...register('internalBarCode')}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                e.preventDefault(); //* evita el submit del formulario
                                                }
                                            }}
                                            error={!!errors.internalBarCode}
                                            errorMessage={errors.internalBarCode?.message}
                                                type="text"
                                                placeholder="Código interno"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    

                    {/* Botones de Acción */}
                    <div className="px-4 lg:px-6 py-4">
                        <div className="flex justify-end gap-4">
                            <Button 
                                type='submit' 
                                className='px-6 lg:px-8 py-3 flex justify-center items-center gap-2 text-lg font-medium'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner className="w-5 h-5" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <HiSave className="w-5 h-5" />
                                        Guardar Producto
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
                
                <FloatMessage
                    key='register-complete-product'
                    {...floatMessageState}
                />
            </div>
    )
}

export { FormRegisterCompleteProduct };
