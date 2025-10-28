'use client'
import React, { useEffect } from 'react';
import { TemplateModal } from '@/ui/components/modals/TemplateModal';
import { SelectMenu, TextInput } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import { RoleEntity } from '@/features/auth/domain/entities/role.entity';
import { useEmpRegisterUserForm } from '../../infraestructure/hooks/useEmpRegisterUserForm';
import { Button } from '@/ui/components/buttons';
import { HiUserAdd } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { useResetUser } from '../../infraestructure/hooks/useResetUser';
import { MdLockReset } from 'react-icons/md';

interface Props {
    userId: bigint,
}

const EmpResetPasswordModal = ({ userId }: Props) => {
  const { register, errors, closeEmployeeModal, employeeModal,handleSubmit, onSubmit, loading, setUserId } = useResetUser()
  
  useEffect(()=>{
    setUserId(userId);
  },[]);

  return (
    <TemplateModal isOpen={employeeModal==='resetPassword'} onClose={closeEmployeeModal} title='Restabler contraseña'>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
        <div>
          <LabelInput value="Nueva contraseña" required="yes" />
          <TextInput
            type="password"
            {...register('password')}
            error={!!errors.password}
            errorMessage={errors.password?.message}
            name="password"
            placeholder="Ej: 9fg89hfg8f9f" />
        </div>
        <div>
          <LabelInput value="Confirmar contraseña" required="yes" />
          <TextInput
            type="password"
            {...register('passwordConfirm')}
            error={!!errors.passwordConfirm}
            errorMessage={errors.passwordConfirm?.message}
            name="passwordConfirm"
            placeholder="Ej: 9fg89hfg8f9f" />
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <Button disabled={loading==='resetPassword'}>
            {loading==='resetPassword'? <Spinner/>: <MdLockReset />}
            Restablecer
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

export { EmpResetPasswordModal }
