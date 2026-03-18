'use client'
import { Button } from '@/shared/ui/components/buttons';
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton';
import { TextInput, SelectMenu, SelectMenuOption } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { Modal } from '@/shared/ui/components/modals';
import { FloatMessage } from '@/shared/ui/components/messages';
import React from 'react'
import { HiSave } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { MdCleaningServices } from 'react-icons/md';
import { useRegisterLotModal } from '../hooks/useRegisterLotModal';
import { useLotDescriptionInputs } from '../hooks/useLotDescriptionInputs';
import { useRegisterInventoryItemStore } from '@/features/inventory/infraestructura/stores/register-inventory-item.store';
import { SuplierEntity } from '@/features/suplier/domain/entities/suplier.entity';
import { forSaleObject } from '@/contexts/product-management/product/domain/enums/for-sale.object';
interface Props {
    supliers: SuplierEntity[]
}
const RegisterLotModal = ({ supliers }:Props) => {
    const suplierOptions: SelectMenuOption[] = supliers.map(item => ({text: item.name, value: item.suplierId.toString()}));
    const {
        handleCloseRegisterLotModal, 
        openModal,
        selectedProductId,
        register,
        handleSubmit,
        onSubmit,
        errors,
        resetFormRegisterLot,
        floatMessageState,
        isLoading
    } = useRegisterLotModal();
    const { inventoryItems } = useRegisterInventoryItemStore();
    
    // Opciones para el select de unidad de compra
    const locationOptions = inventoryItems.map(item=> {
        return{ text: item.location, value: item.inventoryItemId.toString()};
    });;

    const lotDescription = useLotDescriptionInputs;

    return (
        <>
            <Modal isOpen={openModal} onClose={handleCloseRegisterLotModal}>
                <div className='w-full max-w-2xl max-h-[90dvh] mx-4 text-gray-700 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col'>
                    {/* Header fijo */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Registrar nuevo lote
                        </h2>
                        <RoundedButton color='red' onClick={handleCloseRegisterLotModal}>
                            <IoClose />
                        </RoundedButton>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* <div className="md:col-span-2">
                                    <LabelInput value="Número de lote *" />
                                    <TextInput
                                        placeholder="Número del lote"
                                        error={!!errors.lotNumber}
                                        errorMessage={errors.lotNumber?.message}
                                        {...register('lotNumber')}
                                    />
                                </div> */}
                                <div className="md:col-span-1">
                                    <LabelInput 
                                        value="Proveedor"
                                        description={lotDescription.purchasePrice}
                                        required='no' />
                                    <SelectMenu
                                        items={suplierOptions}
                                        error={!!errors.suplierId}
                                        errorMessage={errors.suplierId?.message}
                                        {...register('suplierId')}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <LabelInput 
                                        value="Precio de compra"
                                        description={lotDescription.purchasePrice}
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
                                <div className="md:col-span-1">
                                    <LabelInput 
                                        value="Cantidad comprada"
                                        description={lotDescription.initialQuantity}
                                        required='yes' />
                                    <TextInput
                                        type='number'
                                        step="0.001"
                                        placeholder="Cantidad comprada"
                                        error={!!errors.initialQuantity}
                                        errorMessage={errors.initialQuantity?.message}
                                        {...register('initialQuantity', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Unidad de compra"
                                        description={lotDescription.purchaseUnit}
                                        required='yes' />
                                    <SelectMenu
                                        items={forSaleObject}
                                        error={!!errors.purchaseUnit}
                                        errorMessage={errors.purchaseUnit?.message}
                                        {...register('purchaseUnit')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput 
                                        value="Fecha de recepción"
                                        description={lotDescription.receivedDate}
                                        required='yes' />
                                    <TextInput
                                        type='date'
                                        placeholder="Fecha de recepción"
                                        error={!!errors.receivedDate}
                                        errorMessage={errors.receivedDate?.message}
                                        {...register('receivedDate')}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <LabelInput 
                                        value="Fecha de fabricación"
                                        description={lotDescription.manufacturingDate}
                                        required='no' />
                                    <TextInput
                                        type='date'
                                        placeholder="Fecha de fabricación"
                                        error={!!errors.manufacturingDate}
                                        errorMessage={errors.manufacturingDate?.message}
                                        {...register('manufacturingDate')}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <LabelInput 
                                        value="Fecha de caducidad"
                                        description={lotDescription.expirationDate}
                                        required='no' />
                                    <TextInput
                                        type='date'
                                        placeholder="Fecha de caducidad"
                                        error={!!errors.expirationDate}
                                        errorMessage={errors.expirationDate?.message}
                                        {...register('expirationDate')}
                                    />
                                </div>
                                <div className="md:col-span-2 flex">
                                    <span className='border w-full'></span>
                                </div>
                                <div className="md:col-span-2 flex">
                                    <span>Elige una ubicación para automaticamente agregarlo al inventario. Si no deseas agregar a inventario, no seleccione ninguna opción.</span>
                                </div>
                                <div className="md:col-span-2">
                                    <SelectMenu
                                    items={ locationOptions }
                                        error={!!errors.inventoryItemId}
                                        errorMessage={errors.inventoryItemId?.message}
                                        {...register('inventoryItemId')}
                                    />
                                </div>
                            </div>
                            {/* Botones del formulario */}
                            <div className="flex justify-end gap-3 flex-wrap pt-2">
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
                                    onClick={resetFormRegisterLot}
                                    disabled={isLoading}
                                >
                                    <MdCleaningServices className="mr-2" />
                                    Limpiar campos
                                </Button>
                                <Button
                                    type="button"
                                    color="gray"
                                    className="flex items-center"
                                    onClick={handleCloseRegisterLotModal}
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

export { RegisterLotModal };
