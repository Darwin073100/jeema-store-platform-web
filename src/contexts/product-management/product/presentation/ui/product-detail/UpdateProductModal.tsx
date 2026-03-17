"use client"
import React from 'react'
import { Button } from '@/shared/ui/components/buttons';
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton';
import { SelectMenu, TextInput } from '@/shared/ui/components/inputs';
import { Modal } from '@/shared/ui/components/modals/Modal';
import { IoClose } from 'react-icons/io5';
import { HiPencil, HiSave } from 'react-icons/hi';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { LabelInput } from '@/shared/ui/components/labels';
import { useUpdateProductModal } from '../../../../../../features/product/hooks';
import { FloatMessage } from '@/shared/ui/components/messages/FloatMessage';
import { ForSaleEnum } from '../../../../../../features/product/domain/enums/for-sale.enum';
import { forSaleObject } from '../../../../../../features/product/domain/enums/for-sale.object';
import { useProductDescriptionInput } from '../../../../../../features/product/hooks/useProductDescriptionInput';

interface Props {
    product: any
}

const UpdateProductModal = () => {
    const { 
        isOpenProductModal, 
        handleCloseUpdateProductModal,
        product,
        categories,
        brands,
        seasons,
        isLoading,
        floatMessageState,
        register,
        handleSubmit,
        onSubmit,
        errors,
        resetFormUpdateProduct
    } = useUpdateProductModal();

    // Preparar opciones para los SelectMenu
    const categoryOptions = categories?.length > 0 ? categories.map(category => ({
        value: category.categoryId.toString(),
        text: category.name
    })) : [];

    const brandOptions = brands?.length > 0 ? brands.map(brand => ({
        value: brand.brandId.toString(),
        text: brand.name
    })) : [];

    const seasonOptions = seasons?.length > 0 ? seasons.map(season => ({
        value: season.seasonId.toString(),
        text: season.name
    })) : [];

    const productDescription = useProductDescriptionInput;

    return (
        <Modal isOpen={isOpenProductModal} onClose={handleCloseUpdateProductModal}>
            <div className='w-full max-w-2xl max-h-[90dvh] mx-4 text-gray-700 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col'>
                {/* Header fijo */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Editando: {product?.name || 'Producto'}
                    </h2>
                    <RoundedButton color='red' onClick={handleCloseUpdateProductModal}>
                        <IoClose />
                    </RoundedButton>
                </div>
                
                {/* Contenido con scroll */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <LabelInput 
                                    required='yes'
                                    value="Nombre del producto"
                                    description={productDescription.name} />
                                <TextInput
                                    placeholder="Nombre del producto"
                                    {...register('name')}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>
                            
                            <div className="md:col-span-2">
                                <LabelInput 
                                    required='yes'
                                    value="Código de barras universal"
                                    description={productDescription.universalBarCode} />
                                <TextInput
                                    placeholder="Código de barras universal"
                                    {...register('universalBarCode')}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                        e.preventDefault(); // ⛔ evita el submit del formulario
                                        }
                                    }}
                                />
                                {errors.universalBarCode && <p className="text-red-500 text-sm mt-1">{errors.universalBarCode.message}</p>}
                            </div>
                            
                            <div>
                                <LabelInput 
                                    required='yes'
                                    value="Stock Mínimo Global"
                                    description={productDescription.minStockGlobal} />
                                <TextInput
                                    type='number'
                                    step='0.001'
                                    placeholder="Stock mínimo"
                                    {...register('minStockGlobal', { valueAsNumber: true })}
                                />
                                {errors.minStockGlobal && <p className="text-red-500 text-sm mt-1">{errors.minStockGlobal.message}</p>}
                            </div>
                            
                            <div>
                                <LabelInput 
                                required='yes'
                                    value="Selecciona la categoría" 
                                    htmlFor='category'
                                    description={productDescription.categoryId} />
                                <SelectMenu 
                                    key={`category-${categories.length}`}
                                    id='category'
                                    items={categoryOptions}
                                    {...register('categoryId')}
                                />
                                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                            </div>
                            
                            <div>
                                <LabelInput 
                                    required='yes'
                                    value="Selecciona la marca" 
                                    htmlFor='brand'
                                    description={productDescription.brandId} />
                                <SelectMenu 
                                    key={`brand-${brands.length}`}
                                    id='brand'
                                    items={brandOptions}
                                    {...register('brandId')}
                                />
                                {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId.message}</p>}
                            </div>
                            
                            <div>
                                <LabelInput 
                                    required='yes'
                                    value="Selecciona la temporada" 
                                    htmlFor='season'
                                    description={productDescription.seasonId} />
                                <SelectMenu 
                                    key={`season-${seasons.length}`}
                                    id='season'
                                    items={seasonOptions}
                                    {...register('seasonId')}
                                />
                                {errors.seasonId && <p className="text-red-500 text-sm mt-1">{errors.seasonId.message}</p>}
                            </div>
                            
                            <div className="md:col-span-2">
                                <LabelInput 
                                    required='yes'
                                    value="Unidad de medida para ventas" 
                                    htmlFor='unitOfMeasure'
                                    description={productDescription.unitOfMeasure} />
                                <SelectMenu 
                                    id='unitOfMeasure'
                                    items={forSaleObject}
                                    {...register('unitOfMeasure')}
                                />
                                {errors.unitOfMeasure && <p className="text-red-500 text-sm mt-1">{errors.unitOfMeasure.message}</p>}
                            </div>
                            
                            <div className="md:col-span-2">
                                <LabelInput 
                                    required='no'
                                    value="Descripción del producto"
                                    description={productDescription.description} />
                                <TextInput
                                    placeholder="Descripción"
                                    {...register('description')}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                            </div>
                        </div>
                        
                        {/* Botones del formulario */}
                        <div className="flex justify-end gap-3 flex-wrap pt-4">
                            <Button 
                                type="submit"
                                className='flex justify-center items-center min-w-[120px]'
                                disabled={isLoading}
                            >
                                {isLoading ? <Spinner /> : (
                                    <>
                                        Guardar cambios
                                        <HiPencil className="w-3 h-3" />
                                    </>
                                )}
                            </Button>
                            {/* <Button 
                                type="button"
                                color="yellow" 
                                className="flex items-center"
                                onClick={resetFormUpdateProduct}
                            >
                                <MdCleaningServices className="mr-2" />
                                Limpiar campos
                            </Button> */}
                            <Button 
                                type="button"
                                color="gray" 
                                className="flex items-center" 
                                onClick={handleCloseUpdateProductModal}
                            >
                                <IoClose className="mr-2" />
                                Cerrar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <FloatMessage
                key={floatMessageState.summary || 'message'}
                description={floatMessageState.description || ''}
                summary={floatMessageState.summary || ''}
                type={floatMessageState.type || 'blue'}
                isActive={floatMessageState.isActive || false} 
            />
        </Modal >
    )
}

export { UpdateProductModal };
