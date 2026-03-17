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
import { MdCleaningServices } from 'react-icons/md';
import { useBrandModal } from '../hooks/useBrandModal';
import { useDeleteBrand } from '../hooks/useDeleteBrand';
import { useUpdateBrand } from '../hooks/useUpdateBrand';
import { IBrand } from '@/contexts/product-management/brand/presentation/interfaces/Ibrand';
import { BrandTable } from './BrandTable';

interface Props{
    brandList: IBrand[]
}

const BrandModal = ({ brandList }: Props) => {
    const { 
        modalOpen, setModalOpen,
        floatMessageState, isLoading, 
        handleOpenModal, handleSubmit, register,
        onSubmit, resetForm,errors, isEditMode,
    } = useBrandModal({brandList});
    
    const { floatMessageState: deleteFloatMessage } = useDeleteBrand();
    const { error: updateError } = useUpdateBrand();
    
    

    return (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <div className='w-[450px] text-gray-700 flex flex-col items-center gap-2 bg-white p-4 rounded-md'>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full text-gray-700 flex flex-col items-center gap-2 bg-white p-4">
                    <div className="w-full flex justify-between items-center gap-2">
                        <h2 className="text-lg font-semibold">
                            {isEditMode ? 'Editar Marca' : 'Marcas de productos'}
                        </h2>
                        <RoundedButton color="red" onClick={() => handleOpenModal()}><IoClose /></RoundedButton>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <TextInput
                            {...register('name')}
                            error={!!errors.name}
                            errorMessage={errors.name?.message}
                            placeholder="Nombre de la marca" />
                    </div>
                    <div className="w-full flex justify-end gap-2">
                        <Button className='w-32 flex justify-center items-center'>
                            {isLoading ? <Spinner /> : <>
                                {isEditMode ? 'Actualizar' : 'Guardar'}
                                <HiSave />
                            </>}
                        </Button>
                        <Button color="yellow" onClick={() => resetForm()}><MdCleaningServices />Limpiar campos</Button>
                        <Button color="gray" onClick={() => handleOpenModal()}><IoClose />Cerrar</Button>
                    </div>
                </form>
                <BrandTable/>
            </div>
            <FloatMessage
                key={floatMessageState.summary || 'brand-main'}
                description={floatMessageState.description}
                summary={floatMessageState.summary}
                type={floatMessageState.type}
                isActive={floatMessageState.isActive} />
            
            <FloatMessage
                key={deleteFloatMessage.summary || 'brand-delete'}
                description={deleteFloatMessage.description}
                summary={deleteFloatMessage.summary}
                type={deleteFloatMessage.type}
                isActive={deleteFloatMessage.isActive} />
        </Modal >
    )
}

export { BrandModal };
