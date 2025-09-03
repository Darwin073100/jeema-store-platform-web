import React from 'react'
import { Button } from '@/ui/components/buttons';
import { RoundedButton } from '@/ui/components/buttons/RoundedButton';
import { TextInput, SelectMenu } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { Modal } from '@/ui/components/modals';
import { FloatMessage } from '@/ui/components/messages';
import { HiSave } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { MdCleaningServices } from 'react-icons/md';
import { useRegisterInventoryItemModal } from '../hooks/useRegisterInventoryItemModal';
import { LocationEnum } from '../domain/enums/location.enum';

const RegisterInventoryItemModal = () => {
    const {
        handleFalseSaveOpenModal, 
        saveOpenModal,
        register,
        handleSubmit,
        onSubmit,
        errors,
        resetFormRegisterInventory,
        floatMessageState,
        isLoading
    } = useRegisterInventoryItemModal();

    // Opciones para el select de unidad de compra
    const locationOptions = Object.values(LocationEnum).map(loc => ({
        value: loc,
        text: loc.charAt(0).toUpperCase() + loc.slice(1)
    }));

    return (
        <>
            <Modal isOpen={saveOpenModal} onClose={handleFalseSaveOpenModal}>
                <div className='w-full max-w-2xl max-h-[90dvh] mx-4 text-gray-700 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col'>
                    {/* Header fijo */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Registrar stock para este inventario para este lote
                        </h2>
                        <RoundedButton color='red' onClick={handleFalseSaveOpenModal}>
                            <IoClose />
                        </RoundedButton>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <LabelInput value="Ubicación del stock *" />
                                    <SelectMenu
                                    items={ locationOptions }
                                        error={!!errors.location}
                                        errorMessage={errors.location?.message}
                                        {...register('location')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput value="Unidades en este stock *" />
                                    <TextInput
                                        type='number'
                                        step="0.001"
                                        placeholder="Unidades en este stock"
                                        error={!!errors.quantityOnHand}
                                        errorMessage={errors.quantityOnHand?.message}
                                        {...register('quantityOnHand')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput value="Precio en el que entra al stock *" />
                                    <TextInput
                                        type='number'
                                        step="0.001"
                                        placeholder="Precio en el que entra al stock"
                                        error={!!errors.purchasePriceAtStock}
                                        errorMessage={errors.purchasePriceAtStock?.message}
                                        {...register('purchasePriceAtStock', { valueAsNumber: true })}
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

export { RegisterInventoryItemModal };
