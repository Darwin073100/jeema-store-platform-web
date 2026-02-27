'use client'
import React from 'react';
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { useEmployeeUIStore } from '../../infraestructure/stores/employee-ui.store';
import { Button } from '@/shared/ui/components/buttons';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { BiPencil, BiTrash } from 'react-icons/bi';
import { useEmployeeDeleteUserRoleModal } from '../../infraestructure/hooks/useEmployeeDeleteUserRoleModal';
import { useEmployeeStore } from '../../infraestructure/stores/employee-store';
import { handleOptionUserRole } from '@/shared/lib/utils/role-formatter';

interface Props {
}

const EmployeeDeleteUserRoleModal = ({}: Props) => {
  const { onSubmit } = useEmployeeDeleteUserRoleModal()
  const { userRoleSelected } = useEmployeeStore()
  const { closeEmployeeModal, employeeModal, loading } = useEmployeeUIStore();

  return (
    <TemplateModal isOpen={employeeModal==='deleteUserRole'} onClose={closeEmployeeModal} title='Eliminar rol del usuario'>
      <div className="bg-white p-4 rounded-b-2xl">
        <div>
          <h2>¿Estas seguro de eliminar el rol <span className='text-red-700 font-bold'>{ handleOptionUserRole(userRoleSelected?.role ?? null).text}</span>?</h2>
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <Button color='red' onClick={()=> onSubmit()} disabled={loading==='deleteUserRole'}>
            {loading==='deleteUserRole'? <Spinner size={14}/>: <BiTrash />}
            Eliminar
          </Button>
          <Button color='gray' onClick={()=> closeEmployeeModal()}>
            <IoClose/>
            Cancelar
          </Button>
        </div>
      </div>
    </TemplateModal>
  )
}

export { EmployeeDeleteUserRoleModal }
