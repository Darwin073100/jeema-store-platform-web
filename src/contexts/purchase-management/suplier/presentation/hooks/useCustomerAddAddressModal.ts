'use client';
import * as yup from 'yup';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterAddressMany } from "@/contexts/establishment-management/address/application/dtos/register-address-many.dto";
import { registerAddressAction } from "@/contexts/establishment-management/address/presentation/actions/register-address.action";
import { useSuplierStore } from '../stores/suplier.store';
import { useSuplierUIStore } from '../stores/suplier-ui.store';

export const schema = yup.object().shape({
    addressPostalCode: yup.string().trim()
        .required('El campo codigo postal es obligatorio')
        .typeError('Asegurate de ingresar la información correcta.'),
    addressStreet: yup.string().trim()
        .optional()
        .typeError('Asegurate de ingresar la información correcta.'),
    addressInteriorNumber: yup.string().trim()
        .optional()
        .typeError('Asegurate de ingresar la información correcta.'),
    addressExteriorNumber: yup.string().trim()
        .optional()
        .typeError('Asegurate de ingresar la información correcta.'),
    addressMunicipality: yup.string().trim()
        .required('El campo municipio es obligatorio')
        .min(3, 'El campo ciudad o municipio debe tener mínimo 3 caracteres')
        .typeError('Asegurate de ingresar la información correcta.'),
    addressCity: yup.string().trim()
        .required('El campo ciudad es obligatorio')
        .min(3, 'El campo ciudad debe tener mínimo 3 caracteres')
        .typeError('Asegurate de ingresar la información correcta.'),
    addressState: yup.string().trim()
        .required('El campo estado es obligatorio')
        .min(3, 'El campo estado debe tener mínimo 3 caracteres')
        .typeError('Asegurate de ingresar la información correcta.'),
    addressNighborhood: yup.string().trim()
        .typeError('Asegurate de ingresar la información correcta.'),
    addressCountry: yup.string().trim()
        .required('El campo país es obligatorio')
        .min(3, 'El campo país debe tener mínimo 3 caracteres')
        .typeError('Asegurate de ingresar la información correcta.'),
    addressReference: yup.string().trim()
        .optional().notRequired().default('')
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useSuplierAddAddressModal = () => {
    const { suplier } = useSuplierStore();
    const { 
        floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, suplierModal, closeSuplierModal
    } = useSuplierUIStore();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const handleResetForm = () => {
        reset({
            addressCity: undefined, addressCountry: undefined, addressExteriorNumber: undefined,
            addressInteriorNumber: undefined, addressMunicipality: undefined, addressNighborhood: undefined, addressPostalCode: undefined,
            addressReference: undefined, addressState: undefined, addressStreet: undefined,
        });
    }

    const onSubmit = async (data: FormData) => {
        runLoading('addAddress');

        const addressDTO: RegisterAddressMany = {
            customerId: null,
            branchOfficeId: null,
            employeeId: null,
            suplierId: suplier?.suplierId ?? BigInt(0),
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

        const result = await registerAddressAction(addressDTO);
        stopLoading();

        if (result.ok) {
            closeSuplierModal();
            setFloatMessageState({
                summary: '¡Correcto!',
                description: 'Datos guardados correctamente',
                isActive: true,
                type: 'green'
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 3000);
        } else {
            setFloatMessageState({
                summary: `${result.error?.statusCode}: ¡Error!`,
                description: result.error?.message,
                isActive: true,
                type: 'red'
            });
            setTimeout(() => {
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

export { useSuplierAddAddressModal };