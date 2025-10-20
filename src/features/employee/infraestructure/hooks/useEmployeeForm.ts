'use client';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEmployeeUIStore } from "../stores/employee-ui.store";
import * as yup from 'yup';
import { useForm } from "react-hook-form";

export const schema = yup.object().shape({
    employeeRoleId: yup.string()
        .required('Debes elegir el rol para el empleado.')
        .test('not-empty', 'Debes elegir la categoría del producto.', 
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
    birthDate: yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
    gender: yup.string()
        .nullable()
        .optional()
        .notRequired(),
    hireDate: yup.date()
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

const useEmployeeForm = () => {
    const { setAddressStateCheck, setUserStateCheck, addressStateCheck, userStateCheck } = useEmployeeUIStore();
    const handleUserCheck = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setUserStateCheck(!!e.target.checked.valueOf());
    }
    const handleAddressCheck = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setAddressStateCheck(!!e.target.checked);
    }

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const onSubmit = async (data: FormData) => {
        console.log(data)
    }
    return {
        addressStateCheck, 
        userStateCheck,
        handleAddressCheck,
        handleUserCheck,
        onSubmit,
        handleSubmit,
        register,
        errors,
    }
}

export { useEmployeeForm };