'use client'
import React from 'react'
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Button } from '@/shared/ui/components/buttons';
import { IoSave, IoTrash } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useSuplierUIStore } from '../stores/suplier-ui.store';
import { useSuplierDeleteModal } from '../hooks/useSuplierDeleteModal';
import { useSuplierStore } from '../stores/suplier.store';

const SuplierDeleteModal = () => {
    const { suplierModal, closeSuplierModal } = useSuplierUIStore();
    const { suplier } = useSuplierStore();
    const {loading, onSubmit } = useSuplierDeleteModal();
    return (
        <TemplateModal isOpen={suplierModal === 'deleteSuplier'} onClose={closeSuplierModal}>
            <div className='p-4'>
                <div>
                    <h1>¿Seguro que deseas eliminar a <span className='text-red-700'>{suplier?.name}</span>?</h1>
                </div>
                <Button onClick={()=> onSubmit()} className='w-full mt-4' disabled={loading === 'deleteSuplier'} color='red'>
                    {loading === 'deleteSuplier' ? <Spinner /> : <IoTrash />}
                    Eliminar proveedor
                </Button>
            </div>
        </TemplateModal>
    )
}

export { SuplierDeleteModal };
