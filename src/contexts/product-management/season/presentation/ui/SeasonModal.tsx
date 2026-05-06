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
import { useSeasonModal } from '../hooks/useSeasonModal';
import { SeasonTable } from './SeasonTable';
import { useDeleteSeason } from '../hooks/useDeleteSeason';
import { useUpdateSeason } from '../hooks/useUpdateSeason';
import { ISeason } from '@/contexts/product-management/season/presentation/interfaces/ISeason';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';

interface Props{
    seasonList: ISeason[]
}

const SeasonModal = ({ seasonList }: Props) => {
    const { 
        modalOpen, setModalOpen,
        floatMessageState, isLoading, 
        handleOpenModal, handleSubmit, register,
        onSubmit, resetForm,errors, isEditMode, season,
    } = useSeasonModal({seasonList});
    
    const { floatMessageState: deleteFloatMessage } = useDeleteSeason();
    const { floatMessageState: updateFloatMessage } = useUpdateSeason();

    return (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <div className='w-[650px] text-gray-700 flex flex-col items-center gap-2 bg-white p-4 rounded-md'>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full text-gray-700 flex flex-col items-center gap-2 bg-white p-4">
                    <div className="w-full flex justify-between items-center gap-2">
                        <h2 className="text-lg font-semibold">
                            {isEditMode ? `Editando: ${season?.name}` : 'Temporadas de productos'}
                        </h2>
                        <RoundedButton color="red" onClick={() => handleOpenModal()}><IoClose /></RoundedButton>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <TextInput
                            {...register('name')}
                            error={!!errors.name}
                            errorMessage={errors.name?.message}
                            placeholder="Nombre de la temporada" />
                        <TextInput
                            {...register('description')}
                            error={!!errors.description}
                            errorMessage={errors.description?.message}
                            placeholder="Descripción de la temporada" />
                        <TextInput
                            type='date'
                            {...register('dateInit')}
                            error={!!errors.dateInit}
                            errorMessage={errors.dateInit?.message}
                            placeholder="Inicio de la temporada" />
                        <TextInput
                            type='date'
                            {...register('dateFinish')}
                            error={!!errors.dateFinish}
                            errorMessage={errors.dateFinish?.message}
                            placeholder="Termino de la temporada" />
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
                        <ButtonOutLine onClick={() => resetForm()}><MdCleaningServices />Limpiar campos</ButtonOutLine>
                        <Button color="gray" onClick={() => handleOpenModal()}><IoClose />Cerrar</Button>
                    </div>
                </form>
                <SeasonTable/>
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

export { SeasonModal };
