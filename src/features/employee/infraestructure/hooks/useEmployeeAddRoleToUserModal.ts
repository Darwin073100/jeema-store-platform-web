'use client';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { RoleEntity } from "@/features/auth/domain/entities/role.entity";
import { useEmployeeUIStore } from "../stores/employee-ui.store";
import { SelectMenuOption } from "@/shared/ui/components/inputs";
import { useEmployeeStore } from "../stores/employee-store";
import { AddRoleToUserDTO } from "@/features/auth/application/dtos/add-role-to-user.dto";
import { addRoleToUserAction } from "@/features/auth/actions/add-role-to-user.action";

export const schema = yup.object().shape({
    roleId: yup.string().trim()
        .required('Debes elegir el rol para el usuario.')
        .test('not-empty', 'Debes elegir un rol.', 
        value => value !== undefined && value !== null && value !== '')
        .typeError('Asegurate de ingresar la información correcta.'),
}).required();

type FormData = yup.InferType<typeof schema>;

const useEmployeeAddRoleToUserModal = () => {
    const { 
        floatMessageState, setFloatMessageState, closeEmployeeModal, openEmployeeModal, employeeModal, 
        loading, runLoading, stopLoading
    } = useEmployeeUIStore();
    const { employee } = useEmployeeStore();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const handleOptionsUserRoles = (roles: RoleEntity[]): SelectMenuOption[]=>{
        const rolesOption = roles.map(item => {
            let options: SelectMenuOption = {
                value: '0',
                text: 'Rol no definido',
                additional: 'Rol no definido'
            }
            if(item.name.trim().toLowerCase() === 'global_admin'.trim().toLowerCase()){
                options= {
                    value: item.roleId,
                    text: 'Administrador Global',
                    additional: item.description ?? undefined 
                }
            }
            if(item.name.trim().toLowerCase() === 'establishment_manager'.trim().toLowerCase()){
                options= {
                    value: item.roleId,
                    text: 'Administrador de Establecimiento',
                    additional: item.description ?? undefined 
                }
            }
            if(item.name.trim().toLowerCase() === 'branch_office_management'.trim().toLowerCase()){
                options= {
                    value: item.roleId,
                    text: 'Administrador de Sucursal',
                    additional: item.description ?? undefined 
                }
            }
            if(item.name.trim().toLowerCase() === 'cajero'.trim().toLowerCase()){
                options= {
                    value: item.roleId,
                    text: 'Cajero',
                    additional: item.description ?? undefined 
                }
            }
            if(item.name.trim().toLowerCase() === 'seller'.trim().toLowerCase()){
                options= {
                    value: item.roleId,
                    text: 'Vendedor',
                    additional: item.description ?? undefined 
                }
            }
            return options;
        });
        return rolesOption;
    }

    const onSubmit = async (data: FormData) => {
        runLoading('addRoleToUser');
        const dto: AddRoleToUserDTO = {
            roleId: BigInt(data.roleId),
            userId: BigInt(employee?.user?.userId ?? 0),
        }
        const result = await addRoleToUserAction(dto);
        stopLoading();
        if(result.ok){
            setFloatMessageState({
                summary: '¡Correcto 😁!',
                description: 'Rol agregado al usuario',
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
                description: result.error?.message ??'Error al agregar el rol al usuario',
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
        floatMessageState,
        loading,
        closeEmployeeModal,
        openEmployeeModal,
        employeeModal,
    }
}

export { useEmployeeAddRoleToUserModal };