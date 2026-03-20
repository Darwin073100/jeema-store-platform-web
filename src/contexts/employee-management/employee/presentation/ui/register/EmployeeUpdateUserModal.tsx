'use client'
import React from 'react';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useEmployeeUpdateUserModal } from '../../hooks/hooks/useEmployeeUpdateUserModal';
import { BiPencil } from 'react-icons/bi';

interface Props {
}

const EmployeeUpdateUserModal = ({ }: Props) => {
  const { register, errors, closeEmployeeModal, employeeModal,handleSubmit, onSubmit, loading } = useEmployeeUpdateUserModal()

  return (
    <TemplateModal isOpen={employeeModal==='editUser'} onClose={closeEmployeeModal} title='Editar información de usuario'>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
        <div>
          <LabelInput value="Correo electrónico" required="yes" />
          <TextInput
            type="email"
            {...register('userEmail')}
            error={!!errors.userEmail}
            errorMessage={errors.userEmail?.message}
            name="userEmail"
            placeholder="Ej: ejemplo@domain.com" />
        </div>
        <div>
          <LabelInput value="Nombre de usuario" required="yes" />
          <TextInput
            type="text"
            {...register('userUsername')}
            error={!!errors.userUsername}
            errorMessage={errors.userUsername?.message}
            name="userUsername"
            placeholder="Ej: edwin89" />
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <Button color='yellow' disabled={loading==='editUser'}>
            {loading==='editUser'? <Spinner size={14}/>: <BiPencil />}
            Editar
          </Button>
          <Button color='gray' onClick={()=> closeEmployeeModal()}>
            <IoClose/>
            Cancelar
          </Button>
        </div>
      </form>
    </TemplateModal>
  )
}

export { EmployeeUpdateUserModal }
