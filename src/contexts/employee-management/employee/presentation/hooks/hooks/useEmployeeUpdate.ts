'use client';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { RoleEntity } from "@/features/auth/domain/entities/role.entity";
import { RegisterUserDTO } from "@/features/auth/application/dtos/register-user.dto";
import { RegisterEmployeeDTO } from "../../../../../../features/employee/application/dtos/register-employee.dto";
import { saveEmployeeAction } from "../../actions/save-employee.action";
import { useEmployeeUIStore } from "../../stores/employee-ui.store";
import { useEffect, useState } from 'react';
import { EmployeeEntity } from '../../../../../../features/employee/domain/entities/employee.entity';
import { updateEmployeeAction } from '../../actions/update-employee.action';
import { UpdateEmployeeDTO } from '../../../../../../features/employee/application/dtos/update-employee.dto';
import { formatDateForInput } from '@/shared/lib/utils/date-formatter';
import { useEmployeeStore } from '../../stores/employee-store';

export const schema = yup.object().shape({
    employeeRoleId: yup.string()
        .required('Debes elegir el rol para el empleado.')
        .test('not-empty', 'Debes elegir un rol.', 
            value => value !== undefined && value !== null && value !== ''),
    firstName: yup.string()
        .required('El nombre es obligatorio.')
        .min(3, 'El nombre debe tener mínimo 3 caracteres.')
        .max(100, 'El nombre debe tener máximo 100 caracteres.')
        .typeError('Asegurate de ingresar la información correcta.'),
    lastName: yup.string()
        .required('Los apellidos son obligatorios.')
        .min(3, 'Los apellidos debe tener mínimo 3 caracteres.')
        .max(100, 'Los apellidos debe tener máximo 100 caracteres.')
        .typeError('Asegurate de ingresar la información correcta.'),
    email: yup.string()
        .email('El formato para el correo es alberto@platform.com')
        .optional()
        .notRequired()
        .default('email@virtual.com')
        .typeError('Asegurate de ingresar la información correcta.'),
    phoneNumber: yup.string()
        .required('El número de teléfono es obligatorios.')
        .max(20, 'El número de teléfono debe tener máximo 20 caracteres.')
        .typeError('Asegurate de ingresar la información correcta.'),
    birthDate: yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
    gender: yup.string()
        .nullable()
        .optional()
        .notRequired(),
    hireDate: yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
    currentSalary: yup.number()
        .nullable()
        .optional()
        .notRequired(),
    entryTime: yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
    exitTime: yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
});

type FormData = yup.InferType<typeof schema>;

const useEmployeeUpdate = () => {
    const { employee, setEmployee } = useEmployeeStore()
    const { floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, employeeModal, closeEmployeeModal} = useEmployeeUIStore();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            currentSalary: 0.0
        }
    });

    useEffect(()=>{
        if(employee){
            reset({
                birthDate: employee.birthDate? formatDateForInput(employee.birthDate): null, currentSalary: employee.currentSalary ?? 0,
                email: employee.email ?? '', employeeRoleId: employee.employeeRoleId.toString() ?? '', 
                entryTime: employee.entryTime ?? null, exitTime: employee.exitTime ?? null, firstName: employee.firstName ?? '',
                gender: employee.gender ?? null, hireDate: employee.hireDate? formatDateForInput(employee.hireDate): null, lastName: employee.lastName ?? '', 
                phoneNumber: employee.phoneNumber ?? ''
            });
        }
    },[employeeModal]);

    const onSubmit = async (data: FormData) => {
        runLoading('editEmployee');
        const dto: UpdateEmployeeDTO = {
            isActive: true,
            birthDate: data.birthDate? new Date(data.birthDate): null,
            branchOfficeId: employee?.branchOfficeId ?? BigInt(0),
            currentSalary: Number(data.currentSalary ?? 0),
            email: data.email,
            employeeRoleId: BigInt(data.employeeRoleId),
            entryTime: data.entryTime ?? null,
            exitTime: data.exitTime ?? null,
            firstName: data.firstName,
            gender: data.gender ?? null,
            hireDate: data.hireDate? new Date(data.hireDate): null,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            photoUrl: data.phoneNumber,
            terminationDate: null,
        }
        const result = await updateEmployeeAction(employee?.employeeId ?? BigInt(0), dto)
        stopLoading();
        if(result.ok){
            if(result.value){
                // Actualizar el estado local con los datos actualizados
                setEmployee({
                    ...result.value
                });
            }
            
            setFloatMessageState({
                summary: '¡Correcto!',
                description: 'Información modificada correctamente 😉.',
                isActive: true,
                type: 'green'  
            });
            closeEmployeeModal();
            setTimeout(()=>{
                setFloatMessageState({});
            }, 2500);
        } else {
            setFloatMessageState({
                summary: `${result.error?.statusCode}: ¡Error!`,
                description: `${result.error?.message} 😢.`,
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
        floatMessageState,
        loading,
    }
}

export { useEmployeeUpdate };