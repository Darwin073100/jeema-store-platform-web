import { Button } from '@/shared/ui/components/buttons';
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton';
import { TextInput, SelectMenu } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { Modal } from '@/shared/ui/components/modals';
import { FloatMessage } from '@/shared/ui/components/messages';
import React from 'react'
import { HiSave } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { MdCleaningServices } from 'react-icons/md';
import { ForSaleEnum } from '@/features/product/domain/enums/for-sale.enum';
import { useRegisterInventoryModal } from '../hooks/useRegisterInventoryModal';
import { HiMiniSwatch } from 'react-icons/hi2';
import { useInventoryDescriptionInput } from '../hooks/useInventoryDescriptionInput';

const RegisterInventoryModal = () => {
    const {
        handleFalseSaveOpenModal, 
        handleUseUniversalBarCodeToLocal,
        saveOpenModal,
        register,
        handleSubmit,
        onSubmit,
        errors,
        resetFormRegisterInventory,
        floatMessageState,
        isLoading
    } = useRegisterInventoryModal();

    const inventoryDescription = useInventoryDescriptionInput;

    return (
        <>
            <Modal isOpen={saveOpenModal} onClose={handleFalseSaveOpenModal}>
                <div className='w-full max-w-2xl max-h-[90dvh] mx-4 text-gray-700 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col'>
                    {/* Header fijo */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Registrar inventario para este lote
                        </h2>
                        <RoundedButton color='red' onClick={handleFalseSaveOpenModal}>
                            <IoClose />
                        </RoundedButton>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <div className='flex gap-4'>
                                        <LabelInput 
                                            value="Código de barra interno"
                                            description={inventoryDescription.internalBarCode}
                                            required='yes' />
                                        <Button 
                                            color='yellow'
                                            size='sm'
                                            type='button' 
                                            onClick={()=> handleUseUniversalBarCodeToLocal()}>
                                            <HiMiniSwatch/> 
                                            Usar código del producto
                                        </Button>
                                    </div>
                                    <TextInput
                                        placeholder="Codigo de barra interno"
                                        error={!!errors.internalBarCode}
                                        errorMessage={errors.internalBarCode?.message}
                                        {...register('internalBarCode')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Precio de venta por menudeo"
                                        description={inventoryDescription.salePriceOne}
                                        required='yes' />
                                    <TextInput
                                        type='number'
                                        step="0.0001"
                                        placeholder="Precio de venta por menudeo *"
                                        error={!!errors.salePriceOne}
                                        errorMessage={errors.salePriceOne?.message}
                                        {...register('salePriceOne', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Precio de venta por mayoreo"
                                        description={inventoryDescription.salePriceMany}
                                        required='yes' />
                                    <TextInput
                                        type='number'
                                        step="0.0001"
                                        placeholder="Precio de venta por mayoreo"
                                        error={!!errors.salePriceMany}
                                        errorMessage={errors.salePriceMany?.message}
                                        {...register('salePriceMany', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Unidades para la venta de mayoreo"
                                        description={inventoryDescription.saleQuantityMany}
                                        required='yes' />
                                    <TextInput
                                        type='number'
                                        step="0.0001"
                                        placeholder="Unidades para la venta de mayoreo"
                                        error={!!errors.saleQuantityMany}
                                        errorMessage={errors.saleQuantityMany?.message}
                                        {...register('saleQuantityMany', { valueAsNumber: true })}
                                    />
                                </div>
                                {/* <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Precio especial de venta"
                                        description={inventoryDescription.salePriceSpecial}
                                        required='yes' />
                                    <TextInput
                                        type='number'
                                        step="0.0001"
                                        placeholder="Precio especial de venta"
                                        error={!!errors.salePriceSpecial}
                                        errorMessage={errors.salePriceSpecial?.message}
                                        {...register('salePriceSpecial', { valueAsNumber: true })}
                                    />
                                </div> */}
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Stock mínimo en esta sucursal"
                                        description={inventoryDescription.minStockBranch}
                                        required='yes' />
                                    <TextInput
                                        type='number'
                                        step="0.0001"
                                        placeholder="Stock mínimo en esta sucursal"
                                        error={!!errors.minStockBranch}
                                        errorMessage={errors.minStockBranch?.message}
                                        {...register('minStockBranch', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Stock máximo en esta sucursal"
                                        description={inventoryDescription.maxStockBranch}
                                        required='yes' />
                                    <TextInput
                                        type='number'
                                        step="0.0001"
                                        placeholder="Stock máximo en esta sucursal"
                                        error={!!errors.maxStockBranch}
                                        errorMessage={errors.maxStockBranch?.message}
                                        {...register('maxStockBranch', { valueAsNumber: true })}
                                    />
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
                                            Registrar
                                            <HiSave className="ml-2" />
                                        </>
                                    )}
                                </Button>
                                <Button 
                                    type="button"
                                    color="yellow" 
                                    className="flex items-center"
                                    onClick={resetFormRegisterInventory}
                                    disabled={isLoading}
                                >
                                    <MdCleaningServices className="mr-2" />
                                    Limpiar campos
                                </Button>
                                <Button
                                    type="button"
                                    color="gray"
                                    className="flex items-center"
                                    onClick={handleFalseSaveOpenModal}
                                    disabled={isLoading}
                                >
                                    <IoClose className="mr-2" />
                                    Cerrar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
            
            {/* Float Message para notificaciones */}
            {floatMessageState.isActive && (
                <FloatMessage
                    key={floatMessageState.summary || 'message'}
                    description={floatMessageState.description || ''}
                    summary={floatMessageState.summary || ''}
                    type={floatMessageState.type || 'blue'}
                    isActive={floatMessageState.isActive || false} 
                />
            )}
        </>
    )
}

export { RegisterInventoryModal };
