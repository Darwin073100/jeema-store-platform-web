'use client';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { useCustomerUIStore } from "../stores/customer-ui.store";
import { CustomerTypeEnum } from "../../domain/enums/customer-type-enum";
import { UpdateCustomerDto } from "../../application/dtos/update-customer.dto";
import { updateCustomerAction } from "../actions/update-customer.action";
import { useCustomerStore } from "../stores/customer.store";
import { useEffect } from "react";

export const schema = yup.object().shape({
    firstName: yup.string()
        .required('El nombre es obligatorio.')
        .min(3, 'El nombre debe tener mínimo 3 caracteres.')
        .max(100, 'El nombre debe tener máximo 100 caracteres.')
        .typeError('Asegurate de ingresar la información correcta.'),
    saleDefault: yup.boolean().required(),
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
        .optional()
        .notRequired()
        .max(20, 'El número de teléfono debe tener máximo 20 caracteres.')
        .typeError('Asegurate de ingresar la información correcta.'),
    companyName: yup.string()
        .optional()
        .notRequired()
        .typeError('Asegurate de ingresar la información correcta.'),
    rfc: yup.string()
        .optional()
        .notRequired()
        .typeError('Asegurate de ingresar la información correcta.'),
    customerType: yup.string()
        .optional()
        .notRequired()
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;

const useCustomerUpdateModal = () => {
    const { customer } = useCustomerStore();
    const { floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, customerModal, closeCustomerModal} = useCustomerUIStore();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const handleResetForm = ()=> {
        reset({
            email: customer?.email, firstName: customer?.firstName, lastName: customer?.lastName ?? 'N/A', phoneNumber: customer?.phoneNumber, companyName: customer?.companyName,
            customerType: customer?.customerType,   rfc: customer?.rfc, saleDefault: customer?.saleDefault
        });
    }

    const customerTypeOptions = Object.values(CustomerTypeEnum).map( item => ({
        text: item.toUpperCase(), value: item
    }));

    useEffect(()=> {
        if(customerModal === 'editCustomer'){
            handleResetForm()
        }
    }, [customerModal]);

    const onSubmit = async (data: FormData) => {
        runLoading('editCustomer');

        const registerCustomerDTO: UpdateCustomerDto = {
            customerId: customer?.customerId ?? BigInt(0),
            saleDefault: data.saleDefault,
            firstName: data.firstName,
            lastName: data.lastName ?? null,
            email: data.email ?? null,
            companyName: data.companyName ?? null,
            rfc: data.rfc ?? null,
            customerType: data.customerType ?? null,
            phoneNumber: data.phoneNumber ?? null,
        }

        const result = await updateCustomerAction(registerCustomerDTO);
        stopLoading();

        if(result.ok){
            closeCustomerModal();
            setFloatMessageState({
                summary: '¡Correcto!',
                description: 'Datos guardados correctamente',
                isActive: true,
                type: 'green'  
            });
            setTimeout(()=>{
                setFloatMessageState({});
            }, 3000);
        } else {
            setFloatMessageState({
                summary: `${result.error?.statusCode}: ¡Error!`,
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
        floatMessageState,
        loading,
        customerTypeOptions
    }
}

export { useCustomerUpdateModal };