'use client';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSuplierStore } from "../stores/suplier.store";
import { useSuplierUIStore } from "../stores/suplier-ui.store";
import { UpdateSuplierDto } from "../../application/dtos/update-suplier.dto";
import { updateSuplierAction } from "../actions/update-suplier.action";

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
});

type FormData = yup.InferType<typeof schema>;

const useSuplierUpdateModal = () => {
    const { suplier } = useSuplierStore();
    const { floatMessageState, setFloatMessageState, loading, runLoading, stopLoading, suplierModal, closeSuplierModal } = useSuplierUIStore();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    const handleResetForm = () => {
        reset({
            email: suplier?.email, name: suplier?.name, phoneNumber: suplier?.phoneNumber, contactPerson: suplier?.contactPerson,
            notes: suplier?.notes, rfc: suplier?.rfc
        });
    }

    useEffect(() => {
        if (suplierModal === 'editSuplier') {
            handleResetForm()
        }
    }, [suplierModal]);

    const onSubmit = async (data: FormData) => {
        runLoading('editSuplier');

        const registerCustomerDTO: UpdateSuplierDto = {
            suplierId: suplier?.suplierId ?? BigInt(0),
            contactPerson: data.contactPerson ?? null,
            notes: data.notes ?? null,
            name: data.name,
            email: data.email ?? null,
            rfc: data.rfc ?? null,
            phoneNumber: data.phoneNumber ?? null,
        }

        const result = await updateSuplierAction(registerCustomerDTO);
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

export { useSuplierUpdateModal };