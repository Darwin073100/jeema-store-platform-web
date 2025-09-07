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
import { useRegisterLotUnitPurchaseModal } from '../hooks/useRegisterLotUnitPurchaseModal';
import { useLotUnitPurchaseDescriptionInputs } from '../hooks/useLotUnitPurchaseDescriptionInputs';
import { forSaleObject } from '@/features/product/domain/enums/for-sale.object';

const RegisterLotUnitPurchaseModal = () => {
    const {
        handlecloseSaveIsOpenModal, 
        saveIsOpenModal,
        register,
        handleSubmit,
        onSubmit,
        errors,
        resetFormRegisterLotUnitPurchase,
        floatMessageState,
        isLoading
    } = useRegisterLotUnitPurchaseModal();

    const lotUnitPurchaseDescription = useLotUnitPurchaseDescriptionInputs;

    return (
        <>
            <Modal isOpen={saveIsOpenModal} onClose={handlecloseSaveIsOpenModal}>
                <div className='w-full max-w-2xl max-h-[90dvh] mx-4 text-gray-700 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col'>
                    {/* Header fijo */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Registrar nueva unidad de compra para el lote
                        </h2>
                        <RoundedButton color='red' onClick={handlecloseSaveIsOpenModal}>
                            <IoClose />
                        </RoundedButton>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Unidad de compra"
                                        description={lotUnitPurchaseDescription.unit}
                                        required='yes' />
                                    <SelectMenu
                                        items={forSaleObject}
                                        error={!!errors.unit}
                                        errorMessage={errors.unit?.message}
                                        {...register('unit')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Unidades base en esta unidad"
                                        description={lotUnitPurchaseDescription.unitsInPurchaseUnit}
                                        required='yes' />
                                    <TextInput
                                        type='number'
                                        step="0.001"
                                        placeholder="Unidades base en esta unidad"
                                        error={!!errors.unitsInPurchaseUnit}
                                        errorMessage={errors.unitsInPurchaseUnit?.message}
                                        {...register('unitsInPurchaseUnit', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Cantidades compradas"
                                        description={lotUnitPurchaseDescription.purchaseQuantity}
                                        required='yes' />
                                    <TextInput
                                        placeholder="Cantidades compradas"
                                        error={!!errors.purchaseQuantity}
                                        errorMessage={errors.purchaseQuantity?.message}
                                        {...register('purchaseQuantity')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Precio de compra"
                                        description={lotUnitPurchaseDescription.purchasePrice}
                                        required='yes' />
                                    <TextInput
                                        type='number'
                                        step="0.0001"
                                        placeholder="Precio de compra"
                                        error={!!errors.purchasePrice}
                                        errorMessage={errors.purchasePrice?.message}
                                        {...register('purchasePrice', { valueAsNumber: true })}
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
                                    onClick={resetFormRegisterLotUnitPurchase}
                                    disabled={isLoading}
                                >
                                    <MdCleaningServices className="mr-2" />
                                    Limpiar campos
                                </Button>
                                <Button
                                    type="button"
                                    color="gray"
                                    className="flex items-center"
                                    onClick={handlecloseSaveIsOpenModal}
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

export { RegisterLotUnitPurchaseModal };
