'use client'
import React, { useEffect } from 'react';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Button } from '@/shared/ui/components/buttons';
import { HiUserAdd } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { EstablishmentEntity } from '../domain/entities/establishment.entity';
import { useEstablishmentUIStore } from '../infraestructure/establishment-ui.store';
import { useEstablishmentUpdate } from '../hooks/useEstablishmentUpdate';
import { useEstablishmentNoStorageStore } from '../infraestructure/establishment-no-storage.store';

interface Props {
  establishment: EstablishmentEntity,
}

const EstablishmentUpdateModal = ({ establishment }: Props) => {
  const { register, errors, handleSubmit, onSubmit, loading } = useEstablishmentUpdate()
  const { setEstablishment } = useEstablishmentNoStorageStore();
  const { establishmentModal, closeEstablishmentModal } = useEstablishmentUIStore();
  useEffect(()=>{
    setEstablishment(establishment);
  },[establishment]);
  return (
    <TemplateModal isOpen={establishmentModal === 'update-establishment'} onClose={closeEstablishmentModal} title='Editar información'>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
        <div>
          <LabelInput value="Nombre" required="yes" />
          <TextInput
            {...register('name')}
            type='text'
            error={!!errors.name}
            errorMessage={errors.name?.message}
            name="name"
            placeholder="Ej: Los Tamarindos" />
        </div>
        
        <div className='flex justify-end gap-4 mt-4'>
          <Button>
            {loading === 'update-establishment' ? <Spinner /> : <HiUserAdd />}
            Guardar cambios
          </Button>
          <Button color='gray' onClick={() => closeEstablishmentModal()}>
            <IoClose />
            Cancelar
          </Button>
        </div>
      </form>
    </TemplateModal>
  )
}

export { EstablishmentUpdateModal }
