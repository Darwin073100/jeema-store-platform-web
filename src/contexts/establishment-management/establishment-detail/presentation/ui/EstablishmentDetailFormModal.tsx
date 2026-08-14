'use client'
import React from 'react'
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { TextInput, SelectMenu } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Button } from '@/shared/ui/components/buttons';
import { HiSave } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { EstablishmentDetailTypeEnum } from '@/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum';
import { useEstablishmentDetailForm } from '../hooks/useEstablishmentDetailForm';
import {
  ESTABLISHMENT_DETAIL_TYPE_OPTIONS,
  ESTABLISHMENT_DETAIL_TYPE_PLACEHOLDERS,
} from '../lib/establishment-detail-catalog';

interface Props {
  establishmentId: bigint,
}

const EstablishmentDetailFormModal = ({ establishmentId }: Props) => {
  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    watch,
    loading,
    isModalOpen,
    mode,
    forcedType,
    closeModal,
  } = useEstablishmentDetailForm(establishmentId);

  const selectedType = watch('type') as EstablishmentDetailTypeEnum | undefined;
  // En edición no tiene sentido cambiar el tipo de un registro existente; si
  // se abrió el modal desde un botón "Agregar <tipo>" concreto, el tipo ya
  // viene decidido y se deja fijo para reducir fricción.
  const isTypeLocked = mode === 'edit' || !!forcedType;
  const placeholder = selectedType
    ? ESTABLISHMENT_DETAIL_TYPE_PLACEHOLDERS[selectedType]
    : 'Escribe el dato...';

  return (
    <TemplateModal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={mode === 'edit' ? 'Editar dato de contacto' : 'Agregar dato de contacto'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
        <div>
          <LabelInput value="Tipo" required="yes" />
          <SelectMenu
            {...register('type')}
            items={ESTABLISHMENT_DETAIL_TYPE_OPTIONS}
            error={!!errors.type}
            errorMessage={errors.type?.message}
            disabled={isTypeLocked}
          />
        </div>
        <div>
          <LabelInput value="Valor" required="yes" />
          <TextInput
            {...register('value')}
            type='text'
            error={!!errors.value}
            errorMessage={errors.value?.message}
            name="value"
            placeholder={placeholder} />
        </div>

        <div className='flex justify-end gap-4 mt-4'>
          <Button>
            {loading === 'save-establishment-detail' ? <Spinner /> : <HiSave />}
            Guardar
          </Button>
          <Button color='gray' onClick={() => closeModal()}>
            <IoClose />
            Cancelar
          </Button>
        </div>
      </form>
    </TemplateModal>
  )
}

export { EstablishmentDetailFormModal }
