import React from 'react'
import { Button } from '@/shared/ui/components/buttons';
import { TextInput, SelectMenu } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { HiPencil } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { useLocalTransferInventoryItemModal } from '../../../../../features/inventory/hooks/useLocalTransferInventoryItemModal';
import { useInventoryItemUIStore } from '../../../../../features/inventory/infraestructura/stores/inventory-item-ui.store';
import { FcDeployment, FcShipped, FcShop, FcWorkflow } from 'react-icons/fc';
import { TbTransfer } from 'react-icons/tb';
import { TextArea } from '@/shared/ui/components/inputs/TextInput copy';

const LocalTransferInventoryItemModal = () => {
    const {
        inventoryItem, register, handleSubmit, onSubmit, errors, filterLocations, inventoryItemDescription
    } = useLocalTransferInventoryItemModal();
    const { inventoryItemModal, closeInventoryItemModal, inventoryItemLoading} = useInventoryItemUIStore();

    return (
        <>
            <TemplateModal size='full' isOpen={inventoryItemModal==='transfer'} onClose={closeInventoryItemModal} title='Traspaso Local'>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <h2 className='bg-gray-100 p-2 rounded-md font-semibold flex items-center gap-4'><FcShop /><span>Información del stock de origen</span></h2>
                    <div className='flex gap-4 justify-around'>
                        <div className='flex flex-col justify-center items-center shadow p-4 rounded-2xl'>
                            <span className='flex items-center gap-2'><FcDeployment /> <span>Ubicación</span></span>
                            <span className='font-bold text-blue-600 text-2xl'>{inventoryItem?.location}</span>
                        </div>
                        <div className='flex flex-col justify-center items-center shadow p-4 rounded-2xl'>
                            <span className='flex items-center gap-2'><FcWorkflow /> <span>Stock</span></span>
                            <span className='font-bold text-green-600 text-2xl'>{inventoryItem?.quantityOnHan}</span>
                        </div>
                    </div>
                    <h2 className='bg-gray-100 p-2 rounded-md font-semibold flex items-center gap-4'><FcShipped /><span>Información del stock de destíno</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <LabelInput 
                                value="Ubicación del stock"
                                description={inventoryItemDescription.location}
                                required='yes' />
                            <SelectMenu
                            items={ filterLocations }
                                error={!!errors.location}
                                errorMessage={errors.location?.message}
                                {...register('location')}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <LabelInput 
                                value="Unidades en este stock"
                                required='yes'
                                description={inventoryItemDescription.quantityOnHan} />
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
                            <LabelInput 
                                value="Notas adicionales"
                                required='no'
                                description = 'Agrega una nota adicional' />
                            <TextArea
                                placeholder="Notas adicionales"
                                error={!!errors.notes}
                                errorMessage={errors.notes?.message}
                                {...register('notes')}
                            />
                        </div>
                    </div>
                    {/* Botones del formulario */}
                    <div className="flex justify-end gap-3 flex-wrap pt-4">
                        <Button
                            type="submit"
                            className='flex justify-center items-center min-w-[120px]'
                            disabled={inventoryItemLoading==='transferring'}
                        >
                            {inventoryItemLoading==='transferring' ? <Spinner /> : (
                                <>
                                    <TbTransfer className="w-3 h-3" />
                                </>
                            )}
                            Traspasar
                        </Button>
                        <Button
                            type="button"
                            color="gray"
                            className="flex items-center"
                            onClick={()=> closeInventoryItemModal()}
                            disabled={inventoryItemLoading==='transferring'}
                        >
                            <IoClose className="mr-2" />
                            Cerrar
                        </Button>
                    </div>
                </form>
            </TemplateModal>
        </>
    )
}

export { LocalTransferInventoryItemModal };
