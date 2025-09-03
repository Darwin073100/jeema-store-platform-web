import { Button } from '@/ui/components/buttons';
import { RoundedButton } from '@/ui/components/buttons/RoundedButton';
import { TextInput, SelectMenu } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { Modal } from '@/ui/components/modals';
import { FloatMessage } from '@/ui/components/messages';
import React from 'react'
import { HiPencil, HiSave } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { useUpdateLotModal } from '../hooks/useUpdateLotModal';
import { ForSaleEnum } from '@/features/product/domain/enums/for-sale.enum';

const UpdateLotModal = () => {
    const {
        handleCloseUpdateLotModal, 
        openModal, 
        lot,
        register,
        handleSubmit,
        onSubmit,
        errors,
        floatMessageState,
        isLoading
    } = useUpdateLotModal();

    // Opciones para el select de unidad de compra
    const purchaseUnitOptions = Object.values(ForSaleEnum).map(unit => ({
        value: unit,
        text: unit.charAt(0).toUpperCase() + unit.slice(1)
    }));

    return (
        <>
            <Modal isOpen={openModal} onClose={handleCloseUpdateLotModal}>
                <div className='w-full max-w-2xl max-h-[90dvh] mx-4 text-gray-700 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col'>
                    {/* Header fijo */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Editando: {lot?.lotNumber || 'Lote'}
                        </h2>
                        <RoundedButton color='red' onClick={handleCloseUpdateLotModal}>
                            <IoClose />
                        </RoundedButton>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <LabelInput value="Número de lote *" />
                                    <TextInput
                                        placeholder="Número del lote"
                                        error={!!errors.lotNumber}
                                        errorMessage={errors.lotNumber?.message}
                                        {...register('lotNumber')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput value="Precio de compra *" />
                                    <TextInput
                                        type='number'
                                        step="0.0001"
                                        placeholder="Precio de compra"
                                        error={!!errors.purchasePrice}
                                        errorMessage={errors.purchasePrice?.message}
                                        {...register('purchasePrice', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput value="Cantidad inicial *" />
                                    <TextInput
                                        type='number'
                                        step="0.001"
                                        placeholder="Cantidad inicial"
                                        error={!!errors.initialQuantity}
                                        errorMessage={errors.initialQuantity?.message}
                                        {...register('initialQuantity', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput value="Unidad de compra *" />
                                    <SelectMenu
                                        items={purchaseUnitOptions}
                                        error={!!errors.purchaseUnit}
                                        errorMessage={errors.purchaseUnit?.message}
                                        {...register('purchaseUnit')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput value="Fecha de recepción *" />
                                    <TextInput
                                        type='date'
                                        placeholder="Fecha de recepción"
                                        error={!!errors.receivedDate}
                                        errorMessage={errors.receivedDate?.message}
                                        {...register('receivedDate')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput value="Fecha de fabricación - (opcional)" />
                                    <TextInput
                                        type='date'
                                        placeholder="Fecha de fabricación"
                                        error={!!errors.manufacturingDate}
                                        errorMessage={errors.manufacturingDate?.message}
                                        {...register('manufacturingDate')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <LabelInput value="Fecha de caducidad - (opcional)" />
                                    <TextInput
                                        type='date'
                                        placeholder="Fecha de caducidad"
                                        error={!!errors.expirationDate}
                                        errorMessage={errors.expirationDate?.message}
                                        {...register('expirationDate')}
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
                                            <HiPencil className="w-3 h-3" />
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    color="gray"
                                    className="flex items-center"
                                    onClick={handleCloseUpdateLotModal}
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

export { UpdateLotModal };
