"use client"
import { Button } from '@/shared/ui/components/buttons';
import { RoundedButton } from '@/shared/ui/components/buttons/RoundedButton';
import { TextInput } from '@/shared/ui/components/inputs';
import { Modal } from '@/shared/ui/components/modals/Modal';
import React from 'react'
import { IoClose } from 'react-icons/io5';
import { FloatMessage } from '@/shared/ui/components/messages';
import { HiSave } from 'react-icons/hi';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { CategoryEntity } from '../domain/entities/category.entity';
import { MdCleaningServices } from 'react-icons/md';
import { useCategoryModal } from '../hooks/useCategoryModal';
import { useDeleteCategory } from '../hooks/useDeleteCategory';
import { useUpdateCategory } from '../hooks/useUpdateCategory';
import { CategoryTable } from './CategoryTable';

interface Props{
    categoryList: CategoryEntity[]
}

const CategoryModal = ({ categoryList }: Props) => {
    const { 
        modalOpen, setModalOpen,
        floatMessageState, isLoading, 
        handleOpenModal, handleSubmit, register,
        onSubmit, resetForm,errors, isEditMode, category,
    } = useCategoryModal({categoryList});
    
    const { floatMessageState: deleteFloatMessage } = useDeleteCategory();
    const { floatMessageState: updateFloatMessage } = useUpdateCategory();
    
    

    return (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <div className='w-[500px] text-gray-700 flex flex-col items-center gap-2 bg-white p-4 rounded-md'>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full text-gray-700 flex flex-col items-center gap-2 bg-white p-4">
                    <div className="w-full flex justify-between items-center gap-2">
                        <h2 className="text-lg font-semibold">
                            {isEditMode ? `Editando: ${category?.name}` : 'Categorías de productos'}
                        </h2>
                        <RoundedButton color="red" onClick={() => handleOpenModal()}><IoClose /></RoundedButton>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <TextInput
                            {...register('name')}
                            error={!!errors.name}
                            errorMessage={errors.name?.message}
                            placeholder="Nombre de la categoría" />
                        <TextInput
                            {...register('description')}
                            error={!!errors.description}
                            errorMessage={errors.description?.message}
                            placeholder="Descripción de la categoría" />
                    </div>
                    <div className="w-full flex justify-end gap-2">
                        <Button className='w-32 flex justify-center items-center'>
                            {isLoading ? <Spinner /> : (
                                <>
                                    {isEditMode ? 'Actualizar' : 'Guardar'}
                                    <HiSave />
                                </>
                            )}
                        </Button>
                        <Button color="yellow" onClick={() => resetForm()}><MdCleaningServices />Limpiar campos</Button>
                        <Button color="gray" onClick={() => handleOpenModal()}><IoClose />Cerrar</Button>
                    </div>
                </form>
                <CategoryTable/>
            </div>
            <FloatMessage
                key={floatMessageState.summary}
                description={floatMessageState.description}
                summary={floatMessageState.summary}
                type={floatMessageState.type}
                isActive={floatMessageState.isActive} />
            
            {/* Mensaje de eliminación */}
            <FloatMessage
                key={deleteFloatMessage.summary}
                description={deleteFloatMessage.description}
                summary={deleteFloatMessage.summary}
                type={deleteFloatMessage.type}
                isActive={deleteFloatMessage.isActive} />

            {/* Mensaje de actualización */}
            <FloatMessage
                key={updateFloatMessage.summary}
                description={updateFloatMessage.description}
                summary={updateFloatMessage.summary}
                type={updateFloatMessage.type}
                isActive={updateFloatMessage.isActive} />
        </Modal >
    )
}

export { CategoryModal };
