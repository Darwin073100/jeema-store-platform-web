'use client';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useEmployeeUIStore } from "../../stores/employee-ui.store";
import { SelectMenuOption } from "@/shared/ui/components/inputs";
import { UpdateUserRoleDTO } from "@/features/auth/application/dtos/update-user-role.dto";
import { useEmployeeStore } from "../../stores/employee-store";
import { UserRoleEntity } from "@/features/auth/domain/entities/user-role.entity";
import { updateUserRoleAction } from "@/features/auth/actions/update-user-role.action";
import { IRole } from "@/contexts/authentication-management/role/presentation/interfaces/IRole";

export const schema = yup.object().shape({
    roleId: yup.string().trim()
        .required('Debes elegir el rol para el usuario.')
        .test('not-empty', 'Debes elegir un rol.', 
        value => value !== undefined && value !== null && value !== '')
        .typeError('Asegurate de ingresar la información correcta.'),
}).required();

type FormData = yup.InferType<typeof schema>;

const useEmployeeUpdateUserRoleModal = () => {
    const { 
        floatMessageState, setFloatMessageState, closeEmployeeModal, openEmployeeModal, employeeModal, 
        loading, runLoading, stopLoading
    } = useEmployeeUIStore();
    const {setUserRoleSelected, userRoleSelected} = useEmployeeStore();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    useEffect(()=>{
        reset({roleId: userRoleSelected?.roleId})
    }, [employeeModal==='editUserRole'])
    const handleOpenModal = (userRole: UserRoleEntity)=> {
        openEmployeeModal('editUserRole');
        setUserRoleSelected(userRole);
    }

    const handleOptionsUserRoles = (roles: IRole[]): SelectMenuOption[]=>{
        const rolesOption = roles.map(item => {
            let options: SelectMenuOption = {
                value: '0',
                text: 'Rol no definido',
                additional: 'Rol no definido'
            }
            if(item.name.trim().toLowerCase() === 'global_admin'.trim().toLowerCase()){
                options= {
                    value: item.roleId.toString(),
                    text: 'Administrador Global',
                    additional: item.description ?? undefined 
                }
            }
            if(item.name.trim().toLowerCase() === 'establishment_manager'.trim().toLowerCase()){
                options= {
                    value: item.roleId.toString(),
                    text: 'Administrador de Establecimiento',
                    additional: item.description ?? undefined 
                }
            }
            if(item.name.trim().toLowerCase() === 'branch_office_management'.trim().toLowerCase()){
                options= {
                    value: item.roleId.toString(),
                    text: 'Administrador de Sucursal',
                    additional: item.description ?? undefined 
                }
            }
            if(item.name.trim().toLowerCase() === 'cajero'.trim().toLowerCase()){
                options= {
                    value: item.roleId.toString(),
                    text: 'Cajero',
                    additional: item.description ?? undefined 
                }
            }
            if(item.name.trim().toLowerCase() === 'seller'.trim().toLowerCase()){
                options= {
                    value: item.roleId.toString(),
                    text: 'Vendedor',
                    additional: item.description ?? undefined 
                }
            }
            return options;
        });
        return rolesOption;
    }

    const onSubmit = async (data: FormData) => {
        runLoading('editUserRole');
        const dto: UpdateUserRoleDTO = {
            roleId: BigInt(data.roleId),
            userRoleId: BigInt(userRoleSelected?.userRoleId ?? 0),
        }
        const result = await updateUserRoleAction(dto);
        stopLoading();
        if(result.ok){
            setFloatMessageState({
                summary: '¡Correcto 😁!',
                description: 'Modificación realizada correctamente',
                isActive: true,
                type: 'green'  
            });
            closeEmployeeModal();
            setTimeout(()=>{
                setFloatMessageState({});
            }, 2500);
        } else {
            setFloatMessageState({
                summary: `${result.error?.statusCode}: ¡Error 😐!`,
                description: result.error?.message ??'Error al modificar el rol del usuario',
                isActive: true,
                type: 'red'
            });
            setTimeout(()=>{
                setFloatMessageState({});
            }, 4000);
        }
    }
    return {
        onSubmit,
        handleSubmit,
        register,
        errors,
        handleOptionsUserRoles,
        handleOpenModal,
        floatMessageState,
        loading,
        closeEmployeeModal,
        openEmployeeModal,
        employeeModal,
    }
}

export { useEmployeeUpdateUserRoleModal };