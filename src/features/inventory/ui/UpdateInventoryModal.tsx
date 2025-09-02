import { Button } from '@/ui/components/buttons';
import { RoundedButton } from '@/ui/components/buttons/RoundedButton';
import { TextInput, SelectMenu } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { Modal } from '@/ui/components/modals';
import { FloatMessage } from '@/ui/components/messages';
import React from 'react'
import { HiSave } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { useUpdateInventoryModal } from '../hooks/useUpdateInventoryModal';

const UpdateInventoryModal = () => {
    const {
        handleFalseUpdateOpenModal, 
        updateOpenModal,
        register,
        handleSubmit,
        onSubmit,
        errors,
        floatMessageState,
        isLoading
    } = useUpdateInventoryModal();

    return (
        <>
            <Modal isOpen={updateOpenModal} onClose={handleFalseUpdateOpenModal}>
                <div className='w-full max-w-2xl max-h-[90dvh] mx-4 text-gray-700 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col'>
                    {/* Header fijo */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Modificar inventario
                        </h2>
                        <RoundedButton color='red' onClick={handleFalseUpdateOpenModal}>
                            <IoClose />
                        </RoundedButton>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <LabelInput value="Precio de venta por menudeo *" />
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
                                    <LabelInput value="Precio de venta por mayoreo *" />
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
                                    <LabelInput value="Unidades para la venta de mayoreo *" />
                                    <TextInput
                                        type='number'
                                        step="0.0001"
                                        placeholder="Unidades para la venta de mayoreo"
                                        error={!!errors.saleQuantityMany}
                                        errorMessage={errors.saleQuantityMany?.message}
                                        {...register('saleQuantityMany', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput value="Precio especial de venta *" />
                                    <TextInput
                                        type='number'
                                        step="0.0001"
                                        placeholder="Precio especial de venta"
                                        error={!!errors.salePriceSpecial}
                                        errorMessage={errors.salePriceSpecial?.message}
                                        {...register('salePriceSpecial', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput value="Stock mínimo en esta sucursal *" />
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
                                    <LabelInput value="Stock máximo en esta sucursal *" />
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
                                            Guardar cambios
                                            <HiSave className="ml-2" />
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    color="gray"
                                    className="flex items-center"
                                    onClick={handleFalseUpdateOpenModal}
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

export { UpdateInventoryModal };
