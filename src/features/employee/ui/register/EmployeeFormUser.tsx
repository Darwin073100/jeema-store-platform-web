import { RoleEntity } from '@/features/auth/domain/entities/role.entity';
import { SelectMenu, SelectMenuOption, TextInput } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import React from 'react'
import { useEmployeeForm } from '../../infraestructure/hooks/useEmployeeForm';

interface Props {
    register: any,
    errors: any,
    userRoles: RoleEntity[],
}
const EmployeeFormUser = ({ errors, register, userRoles}: Props) => {
    const { handleOptionsUserRoles, optionUserRoleSelected } = useEmployeeForm();

    return (
        <div className="w-full">
            <h1 className="text-green-600 font-semibold bg-green-100 rounded-t-2xl p-2 text-lg uppercase text-center">Usuario para accesar al sistema</h1>
            <div className="bg-white p-4 rounded-b-2xl">
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
            </div>
        </div>
    )
}

export { EmployeeFormUser };
