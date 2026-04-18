'use client'
import React from 'react'
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Button } from '@/shared/ui/components/buttons';
import { SelectMenu, TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { IoSave } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { TextArea } from '@/shared/ui/components/inputs/TextInput copy';
import { useSuplierUIStore } from '../stores/suplier-ui.store';
import { useSuplierUpdateModal } from '../hooks/useSuplierUpdateModal';

const SuplierUpdateModal = () => {
    const { suplierModal, closeSuplierModal } = useSuplierUIStore();
    const { errors, handleSubmit, loading, onSubmit, register } = useSuplierUpdateModal();
    return (
        <TemplateModal isOpen={suplierModal === 'editSuplier'} onClose={closeSuplierModal}>
            <form onSubmit={handleSubmit(onSubmit)} className='p-4'>
                <div>
                    <LabelInput value="Nombre del proveedor" required="yes" />
                    <TextInput
                        {...register('name')}
                        type='text'
                        error={!!errors.name}
                        errorMessage={errors.name?.message}
                        name="name"
                        placeholder="Ej: Chedraui Ometepec" />
                </div>
                <div>
                    <LabelInput value="Persona de contacto" required="no" />
                    <TextInput
                        {...register('contactPerson')}
                        type='text'
                        error={!!errors.contactPerson}
                        errorMessage={errors.contactPerson?.message}
                        name="contactPerson"
                        placeholder="Ej: Fernano Marin Garcia" />
                </div>
                <div>
                    <LabelInput value="Número de teléfono" required="no" />
                    <TextInput
                        {...register('phoneNumber')}
                        type="tel"
                        error={!!errors.phoneNumber}
                        errorMessage={errors.phoneNumber?.message}
                        name="phoneNumber"
                        placeholder="Ej: 7417682345" />
                </div>
                <div>
                    <LabelInput value="Correo" required="no" />
                    <TextInput
                        {...register('email')}
                        type="email"
                        error={!!errors.email}
                        errorMessage={errors.email?.message}
                        name="email"
                        placeholder="Ej: roberto@email.com" />
                </div>
                <div>
                    <LabelInput value="Ingresa el RFC del proveedor" required="no" />
                    <TextInput
                        {...register('rfc')}
                        error={!!errors.rfc}
                        errorMessage={errors.rfc?.message}
                        name="rfc"
                        placeholder='Ingresa el RFC del proveedor' />
                </div>
                <div>
                    <LabelInput value="Nota o comentario" required="no" />
                    <TextArea
                        {...register('notes')}
                        error={!!errors.notes}
                        errorMessage={errors.notes?.message}
                        name="notes"
                        placeholder='Este proveedor es mayorista.' />
                </div>
                <Button type='submit' className='w-full mt-4' disabled={loading === 'editSuplier'}>
                    {loading === 'editSuplier' ? <Spinner /> : <IoSave />}
                    Guradar cambios
                </Button>
            </form>
        </TemplateModal>
    )
}

export { SuplierUpdateModal };
