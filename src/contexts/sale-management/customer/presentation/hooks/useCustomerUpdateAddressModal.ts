'use client';
import * as yup from 'yup';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCustomerStore } from "../stores/customer.store";
import { useCustomerUIStore } from "../stores/customer-ui.store";
import { CustomerTypeEnum } from "../../domain/enums/customer-type-enum";
import { UpdateAddressMany } from '@/contexts/establishment-management/address/application/dtos/update-address-many.dto';
import { updateAddressAction } from '@/contexts/establishment-management/address/presentation/actions/update-address.action';

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

const useCustomerUpdateAddressModal = () => {
    const { customer } = useCustomerStore();
    const { 
        floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, customerModal, closeCustomerModal 
    } = useCustomerUIStore();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const handleResetForm = () => {
        reset({
            addressCity: customer?.address?.city ?? '', addressCountry: customer?.address?.country ?? '', addressExteriorNumber: customer?.address?.externalNumber ?? '',
            addressInteriorNumber: customer?.address?.internalNumber ?? '', addressMunicipality: customer?.address?.municipality ?? '', addressNighborhood: customer?.address?.neighborhood ?? '', 
            addressPostalCode: customer?.address?.postalCode ?? '', addressReference: customer?.address?.reference ?? '', addressState: customer?.address?.state ?? '', 
            addressStreet: customer?.address?.street ?? '',
        });
    }

    useEffect(()=> {
        if(customerModal==='editAddress'){
            handleResetForm();
        }
    }, [customerModal]);

    const customerTypeOptions = Object.values(CustomerTypeEnum).map(item => ({
        text: item.toUpperCase(), value: item
    }));

    const onSubmit = async (data: FormData) => {
        runLoading('editAddress');

        const addressDTO: UpdateAddressMany = {
            addressId: customer?.addressId ?? BigInt(0),
            customerId: customer?.customerId ?? BigInt(0),
            branchOfficeId: null,
            employeeId: null,
            suplierId: null,
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

        const result = await updateAddressAction(addressDTO);
        stopLoading();

        if (result.ok) {
            closeCustomerModal();
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
        customerTypeOptions
    }
}

export { useCustomerUpdateAddressModal };