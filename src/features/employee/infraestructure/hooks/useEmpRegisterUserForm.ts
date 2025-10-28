'use client';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { RoleEntity } from "@/features/auth/domain/entities/role.entity";
import { RegisterUserDTO } from "@/features/auth/application/dtos/register-user.dto";
import { useEmployeeUIStore } from "../stores/employee-ui.store";
import { SelectMenuOption } from "@/ui/components/inputs";
import { registerUserAction } from "@/features/auth/actions/register-user.action";
import { useWorkspace } from "@/shared/hooks/useAuth";

export const schema = yup.object().shape({
    //? VALIDACION PARA EL USUARIO
    userCheck: yup.boolean().required(),
    userRoleId: yup.string().trim().when('userCheck',{
        is: true,
        then: (schema)=> schema
            .required('Debes elegir el rol para el usuario.')
            .test('not-empty', 'Debes elegir un rol.', 
            value => value !== undefined && value !== null && value !== '')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    userUsername: yup.string().trim().when('userCheck',{
        is: true,
        then: (schema)=> schema
            .required('La campo nombre de usuario es obligatorio.')
            .min(3, 'Mínimo 3 caracteres debes escribir')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    userEmail: yup.string().trim().when('userCheck',{
        is: true,
        then: (schema)=> schema
            .required('El campo correo es obligatorio.')
            .email('El formato para el correo es alberto@platform.com.mx')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    userPassword: yup.string().trim().when('userCheck',{
        is: true,
        then: (schema)=> schema
            .required('La contraseña es obligatoria.')
            .min(8,'La contraseña debe tener al menos 8 caracteres.')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    userPasswordConfirm: yup.string().trim().when('userCheck',{
        is: true,
        then: (schema)=> schema
            .required('Debes confirmar tu contraseña.')
            .oneOf([yup.ref('userPassword')], 'Las contraseñas no coindicen.')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
});

type FormData = yup.InferType<typeof schema>;

const useEmpRegisterUserForm = () => {
    const [ employeeId, setEmployeeId ] = useState<bigint>(BigInt(0));

    const { 
        floatMessageState, setFloatMessageState, closeEmployeeModal, openEmployeeModal, employeeModal, 
        loading, runLoading, stopLoading
    } = useEmployeeUIStore();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            userCheck: true,
        }
    });
    const optionUserRoleSelected = watch('userRoleId');
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

    const handleResetForm = ()=> {
        reset({
            userCheck: true, userEmail: undefined, userPassword: undefined, userPasswordConfirm: undefined, 
            userRoleId: undefined, userUsername: undefined
        });
    }

    const userCheck = watch('userCheck');
    const onSubmit = async (data: FormData) => {
        let userDTO: RegisterUserDTO | null = null;
        if(userCheck){
            runLoading('registerUser');
            userDTO = {
                email: data.userEmail ?? '',
                employeeId: employeeId,
                roleId: BigInt(data.userRoleId ?? 0),
                passwordHash: data.userPassword ?? '',
                username: data.userUsername ?? ''
            }
            const result = await registerUserAction(userDTO);
            stopLoading();
            if(result.ok){
                setFloatMessageState({
                    summary: '¡Correcto!',
                    description: 'Datos guardados correctamente',
                    isActive: true,
                    type: 'green'  
                });
                handleResetForm();
                closeEmployeeModal();
                setTimeout(()=>{
                    setFloatMessageState({});
                }, 2500);
            } else {
                setFloatMessageState({
                    summary: `${result.error?.statusCode}: ¡Error!`,
                    description: result.error?.message ??'Error al registrar el usuario',
                    isActive: true,
                    type: 'red'
                });
                setTimeout(()=>{
                    setFloatMessageState({});
                }, 4000);
            }
        }
    }
    return {
        onSubmit,
        handleSubmit,
        register,
        errors,
        handleOptionsUserRoles,
        optionUserRoleSelected,
        floatMessageState,
        loading,
        closeEmployeeModal,
        openEmployeeModal,
        employeeModal,
        setEmployeeId
    }
}

export { useEmpRegisterUserForm };