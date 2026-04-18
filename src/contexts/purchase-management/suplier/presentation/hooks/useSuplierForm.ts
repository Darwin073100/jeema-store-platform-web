'use client';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { useSuplierUIStore } from "../stores/suplier-ui.store";
import { registerSuplierAction } from "../actions/register-suplier.action";
import { RegisterAddress } from "@/contexts/establishment-management/address/application/dtos/register-address.dto";

export const schema = yup.object().shape({
    notes: yup.string()
        .optional()
        .notRequired()
        .typeError('Asegurate de ingresar la información correcta.'),
    name: yup.string()
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
        .optional()
        .notRequired()
        .max(20, 'El número de teléfono debe tener máximo 20 caracteres.')
        .typeError('Asegurate de ingresar la información correcta.'),
    contactPerson: yup.string()
        .optional()
        .notRequired()
        .typeError('Asegurate de ingresar la información correcta.'),
    rfc: yup.string()
        .optional()
        .notRequired()
        .typeError('Asegurate de ingresar la información correcta.'),
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
});

type FormData = yup.InferType<typeof schema>;

const useSuplierForm = () => {
    const { floatMessageState, setFloatMessageState, loading, runLoading, stopLoading} = useSuplierUIStore();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            addressCheck: false,
        }
    });

    const handleResetForm = ()=> {
        reset({
            addressCheck: false, addressCity: undefined, addressCountry: undefined, addressExteriorNumber: undefined,
            addressInteriorNumber: undefined, addressMunicipality: undefined, addressNighborhood: undefined, addressPostalCode: undefined,
            addressReference: undefined, addressState: undefined, addressStreet: undefined, email: '', name: '',
            notes: '',  contactPerson: '', phoneNumber: '', rfc: ''
        });
    }

    const addressCheck = watch('addressCheck');

    const onSubmit = async (data: FormData) => {
        runLoading('saveSuplier');
        
        let addressDTO: RegisterAddress | null = null;
        if(addressCheck){
            addressDTO = {
                country: data.addressCountry ?? '',
                state: data.addressState ?? '',
                postalCode: data.addressPostalCode ?? '',
                municipality: data.addressMunicipality ?? '',
                city: data.addressCity ?? '',
                neighborhood: data.addressNighborhood ?? null,
                street: data.addressStreet ?? null,
                internalNumber: data.addressInteriorNumber ?? null,
                externalNumber: data.addressExteriorNumber ?? null,
                reference: data.addressReference ?? null
            }
        }

        const registerCustomerDTO = {
            name: data.name,
            notes: data.notes ?? null,
            email: data.email ?? null,
            contactPerson: data.contactPerson ?? null,
            rfc: data.rfc ?? null,
            phoneNumber: data.phoneNumber ?? null,
            address: addressDTO ?? null,
        }

        const result = await registerSuplierAction(registerCustomerDTO);
        stopLoading();

        if(result.ok){
            setFloatMessageState({
                summary: '¡Correcto 😁!',
                description: 'Datos guardados correctamente',
                isActive: true,
                type: 'green'  
            });
            handleResetForm();
            setTimeout(()=>{
                setFloatMessageState({});
            }, 3000);
        } else {
            setFloatMessageState({
                summary: `${result.error?.statusCode}: ¡Error 😢!`,
                description: result.error?.message,
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
        addressCheck,
        floatMessageState,
        loading,
    }
}

export { useSuplierForm };