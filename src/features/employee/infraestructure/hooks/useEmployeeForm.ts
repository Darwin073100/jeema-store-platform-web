'use client';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEmployeeUIStore } from "../stores/employee-ui.store";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { useEffect } from "react";

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
    //?VALIDACION PARA LA DIRECCION
    addressCheck: yup.boolean().required(),
    addressPostalCode: yup.string().trim().when('addressCheck',{
        is: true,
        then: (schema)=> schema
            .required('El campo codigo postal es obligatorio')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    addressStreet: yup.string().trim().when('addressCheck',{
        is: true,
        then: (schema)=> schema
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    addressInteriorNumber: yup.string().trim().when('addressCheck',{
        is: true,
        then: (schema)=> schema
            .optional()
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    addressExteriorNumber: yup.string().trim().when('addressCheck',{
        is: true,
        then: (schema)=> schema
            .optional()
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    addressMunicipality: yup.string().trim().when('addressCheck',{
        is: true,
        then: (schema)=> schema
            .required('El campo municipio es obligatorio')
            .min(3, 'El campo ciudad o municipio debe tener mínimo 3 caracteres')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    addressCity: yup.string().trim().when('addressCheck',{
        is: true,
        then: (schema)=> schema
            .required('El campo ciudad es obligatorio')
            .min(3, 'El campo ciudad debe tener mínimo 3 caracteres')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    addressState: yup.string().trim().when('addressCheck',{
        is: true,
        then: (schema)=> schema
            .required('El campo estado es obligatorio')
            .min(3, 'El campo estado debe tener mínimo 3 caracteres')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    addressNighborhood: yup.string().trim().when('addressCheck',{
        is: true,
        then: (schema)=> schema
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    addressCountry: yup.string().trim().when('addressCheck',{
        is: true,
        then: (schema)=> schema
            .required('El campo país es obligatorio')
            .min(3, 'El campo país debe tener mínimo 3 caracteres')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    addressReference: yup.string().trim().when('addressCheck',{
        is: true,
        then: (schema)=> schema
            .optional().notRequired().default('')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    //? VALIDACION PARA EL USUARIO
    userCheck: yup.boolean().required(),
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

const useEmployeeForm = () => {
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            userCheck: false,
            addressCheck: false,
            currentSalary: 0.0
        }
    });

    const userCheck = watch('userCheck');
    useEffect(()=>{
        if(!userCheck){
        // reset({
        //     userUsername: undefined
        // })
    }
    }, [userCheck]);
    const addressCheck = watch('addressCheck');

    const onSubmit = async (data: FormData) => {
        console.log(data)
    }
    return {
        onSubmit,
        handleSubmit,
        register,
        errors,
        userCheck,
        addressCheck
    }
}

export { useEmployeeForm };