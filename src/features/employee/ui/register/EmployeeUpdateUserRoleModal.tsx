'use client'
import React from 'react';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { SelectMenu } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { RoleEntity } from '@/features/auth/domain/entities/role.entity';
import { useEmployeeUIStore } from '../../infraestructure/stores/employee-ui.store';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { BiPencil } from 'react-icons/bi';
import { useEmployeeUpdateUserRoleModal } from '../../infraestructure/hooks/useEmployeeUpdateUserRoleModal';

interface Props {
  roles: RoleEntity[]
}

const EmployeeUpdateUserRoleModal = ({ roles }: Props) => {
  const { handleOptionsUserRoles, register, errors, handleSubmit, onSubmit } = useEmployeeUpdateUserRoleModal()
  const { closeEmployeeModal, employeeModal, loading } = useEmployeeUIStore();

  return (
    <TemplateModal isOpen={employeeModal==='editUserRole'} onClose={closeEmployeeModal} title='Modificar rol del usuario'>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
        <div>
          <LabelInput value="Típo de usuario" required="yes" />
          <SelectMenu
            {...register('roleId')}
            error={!!errors.roleId}
            errorMessage={errors.roleId?.message}
            name="roleId"
            items={handleOptionsUserRoles(roles)} />
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <Button color='yellow' disabled={loading==='editUserRole'}>
            {loading==='editUserRole'? <Spinner size={14}/>: <BiPencil />}
            Modificar
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

export { EmployeeUpdateUserRoleModal }
