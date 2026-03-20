'use client'
import React, { useEffect } from 'react';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { SelectMenu, TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { RoleEntity } from '@/features/auth/domain/entities/role.entity';
import { useEmpRegisterUserForm } from '../../hooks/hooks/useEmpRegisterUserForm';
import { Button } from '@/shared/ui/components/buttons';
import { HiUserAdd } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';

interface Props {
    userRoles: RoleEntity[],
    employeeId: bigint,
}

const EmpRegisterUserModal = ({ userRoles, employeeId }: Props) => {
  const { handleOptionsUserRoles, register, errors, closeEmployeeModal, employeeModal,handleSubmit, onSubmit, loading, setEmployeeId } = useEmpRegisterUserForm()
  
  useEffect(()=>{
    setEmployeeId(employeeId);
  },[]);

  return (
    <TemplateModal isOpen={employeeModal==='registerUser'} onClose={closeEmployeeModal} title='Crear usuario'>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
        <div>
          <LabelInput value="Típo de usuario" required="yes" />
          <SelectMenu
            {...register('userRoleId')}
            error={!!errors.userRoleId}
            errorMessage={errors.userRoleId?.message}
            name="userRoleId"
            items={handleOptionsUserRoles(userRoles)} />
        </div>
        <div>
          <LabelInput value="Nombre de usuario(Alias)" required="yes" />
          <TextInput
            {...register('userUsername')}
            error={!!errors.userUsername}
            errorMessage={errors.userUsername?.message}
            name="userUsername"
            placeholder="Ej: robert54" />
        </div>
        <div>
          <LabelInput value="Correo" required="yes" />
          <TextInput
            type="email"
            {...register('userEmail')}
            error={!!errors.userEmail}
            errorMessage={errors.userEmail?.message}
            name="userEmail"
            placeholder="Ej: roberto@email.com" />
        </div>
        <div>
          <LabelInput value="Asignar contraseña" required="yes" />
          <TextInput
            type="password"
            {...register('userPassword')}
            error={!!errors.userPassword}
            errorMessage={errors.userPassword?.message}
            name="userPassword"
            placeholder="Ej: 9fg89hfg8f9f" />
        </div>
        <div>
          <LabelInput value="Confirmar contraseña" required="yes" />
          <TextInput
            type="password"
            {...register('userPasswordConfirm')}
            error={!!errors.userPasswordConfirm}
            errorMessage={errors.userPasswordConfirm?.message}
            name="userPasswordConfirm"
            placeholder="Ej: 9fg89hfg8f9f" />
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <Button>
            {loading==='registerUser'? <Spinner/>: <HiUserAdd/>}
            Registrar usuario
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

export { EmpRegisterUserModal }
