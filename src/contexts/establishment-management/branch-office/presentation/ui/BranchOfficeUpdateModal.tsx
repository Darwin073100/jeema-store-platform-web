'use client'
import React from 'react'
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Button } from '@/shared/ui/components/buttons';
import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { IoSave } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useBranchOfficeUIStore } from '../stores/branch-office-ui.store';
import { useBranchOfficeUpdateModal } from '../hooks/useBranchOfficeUpdateModal';

const BranchOfficeUpdateModal = () => {
    const { branchOfficeModal, closeBranchOfficeModal } = useBranchOfficeUIStore();
    const { errors, handleSubmit, loading, onSubmit, register } = useBranchOfficeUpdateModal();
    return (
        <TemplateModal isOpen={branchOfficeModal === 'editBranchOffice'} onClose={closeBranchOfficeModal} title='Editar sucursal'>
            <form onSubmit={handleSubmit(onSubmit)} className='p-4'>
                <div>
                    <LabelInput value="Pais" required="yes" />
                    <TextInput
                        type="text"
                        {...register('name')}
                        error={!!errors.name}
                        errorMessage={errors.name?.message}
                        name="name"
                        placeholder="Ej: Los Tamarindos(Suc 1)" />
                </div>
                <Button type='submit' className='w-full mt-4' disabled={loading === 'editBranchOffice'}>
                    {loading === 'editBranchOffice' ? <Spinner /> : <IoSave />}
                    Guradar cambios
                </Button>
            </form>
        </TemplateModal>
    )
}

export { BranchOfficeUpdateModal };
