'use client'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LabelInput } from '../../../../../shared/ui/components/labels';
import { TextInput } from '../../../../../shared/ui/components/inputs';
import { Button } from '../../../../../shared/ui/components/buttons';
import { FloatMessage } from '@/shared/ui/components/messages';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { FloatMessageType } from '@/shared/ui/types/FloatMessageType';
import { createNewBranchOfficeAction } from '../actions/create.new.branch-office.action';
import { useRouter } from 'next/navigation';
import { HiMiniArrowLongRight } from 'react-icons/hi2';
import { useEstablishmentStore } from '@/contexts/establishment-management/establishment/presentation/stores/establishment.store';
import { useBranchOfficeStorageStore } from '../stores/branch-office-storage.store';
import { TextArea } from '@/shared/ui/components/inputs/TextInput copy';
import { RegisterBranchOfficeDto } from '../../application/dtos/register-branch-office.dto';

const schema = yup.object().shape({
    name: yup.string().trim()
        .required('El campo nombre es obligatorio')
        .min(3, 'El valor minimo debe ser de 3 caracteres'),
    postalCode: yup.string().trim()
        .required('El campo codigo postal es obligatorio')
        .typeError('Asegurate de ingresar la información correcta.'),
    street: yup.string().trim()
        .optional()
        .typeError('Asegurate de ingresar la información correcta.'),
    interiorNumber: yup.string().trim()
        .optional()
        .typeError('Asegurate de ingresar la información correcta.'),
    exteriorNumber: yup.string().trim()
        .optional()
        .typeError('Asegurate de ingresar la información correcta.'),
    municipality: yup.string().trim()
        .required('El campo municipio es obligatorio')
        .min(3, 'El campo ciudad o municipio debe tener mínimo 3 caracteres')
        .typeError('Asegurate de ingresar la información correcta.'),
    city: yup.string().trim()
        .required('El campo ciudad es obligatorio')
        .min(3, 'El campo ciudad debe tener mínimo 3 caracteres')
        .typeError('Asegurate de ingresar la información correcta.'),
    state: yup.string().trim()
        .required('El campo estado es obligatorio')
        .min(3, 'El campo estado debe tener mínimo 3 caracteres')
        .typeError('Asegurate de ingresar la información correcta.'),
    neighborhood: yup.string().trim()
        .typeError('Asegurate de ingresar la información correcta.'),
    country: yup.string().trim()
        .required('El campo país es obligatorio')
        .min(3, 'El campo país debe tener mínimo 3 caracteres')
        .typeError('Asegurate de ingresar la información correcta.'),
    reference: yup.string().trim()
        .optional().notRequired().default('')
        .typeError('Asegurate de ingresar la información correcta.')
});

type FormData = yup.InferType<typeof schema>


export const CreateBranchForm = () => {
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState(false);
    const { establishment } = useEstablishmentStore();
    const { setBranchOffice } = useBranchOfficeStorageStore();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    const onSubmit = async (data: FormData) => {
        setFloatMessageState(() => ({}));
        setIsLoading(true);

        let resp;
        const branch: RegisterBranchOfficeDto = {
            name: data.name,
            establishmentId: establishment?.establishmentId ?? BigInt(0),
            address: {
                street: data.street ?? null,
                internalNumber: data.interiorNumber ?? null,
                externalNumber: data.exteriorNumber ?? null,
                postalCode: data.postalCode,
                neighborhood: data.neighborhood ?? null,
                municipality: data.municipality,
                country: data.country,
                city: data.city,
                state: data.state,
                reference: data.reference?.toString() ?? null
            }
        };

        resp = await createNewBranchOfficeAction(branch);

        if (resp?.ok) {
            setFloatMessageState(() => ({
                description: 'Sucursal creada correctamente',
                summary: '¡Correcto!',
                isActive: true,
                type: 'green'
            }));

            resp.value ? setBranchOffice(resp.value) : null;

            router.push('/initial/first-user')
        } else {
            setIsLoading(false);
            setFloatMessageState(() => ({
                description: resp?.error?.message,
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            }));
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-full rounded-2xl shadow-md p-4 flex flex-col gap-4">
                <h1 className="text-3xl mb-4 text-gray-700">Alta de una sucursal</h1>
                <div className='w-full flex max-sm:flex-col justify-center gap-4'>
                    <div className='w-full'>
                        <div>
                            <LabelInput htmlFor="name" value="Nombre de la sucursal" required='yes' />
                            <TextInput
                                {...register('name')}
                                error={!!errors.name}
                                errorMessage={errors.name?.message}
                                name="name" placeholder="La Guadalupe 1" />
                        </div>
                        <div>
                            <LabelInput htmlFor="country" value="País" required='yes' />
                            <TextInput
                                {...register('country')}
                                error={!!errors.country}
                                errorMessage={errors.country?.message}
                                name="country" placeholder="México" />
                        </div>
                        <div>
                            <LabelInput htmlFor="state" value="Estado" required='yes' />
                            <TextInput
                                {...register('state')}
                                error={!!errors.state}
                                errorMessage={errors.state?.message}
                                name="state" placeholder="Guerrero" />
                        </div>
                        <div>
                            <LabelInput htmlFor="postalCode" value="Codigo postal" required='yes' />
                            <TextInput
                                {...register('postalCode')}
                                error={!!errors.postalCode}
                                errorMessage={errors.postalCode?.message}
                                name="postalCode" placeholder="41700" type="text" />
                        </div>
                        <div>
                            <LabelInput htmlFor="municipality" value="Municipio" required='yes' />
                            <TextInput
                                {...register('municipality')}
                                error={!!errors.municipality}
                                errorMessage={errors.municipality?.message}
                                name="municipality" placeholder="Ometepec" />
                        </div>
                        <div>
                            <LabelInput htmlFor="city" value="Ciudad o comunidad" required='yes' />
                            <TextInput
                                {...register('city')}
                                error={!!errors.city}
                                errorMessage={errors.city?.message}
                                name="city" placeholder="Ometepec" />
                        </div>
                    </div>
                    <div className='w-full'>
                        <div>
                            <LabelInput htmlFor="neighborhood" value="Colonia" required='no' />
                            <TextInput
                                {...register('neighborhood')}
                                error={!!errors.neighborhood}
                                errorMessage={errors.neighborhood?.message}
                                name="neighborhood" placeholder="Barrio de la Guadalupe" />
                        </div>
                        <div>
                            <LabelInput htmlFor="street" value="Nombre de la calle" required='no' />
                            <TextInput
                                {...register('street')}
                                error={!!errors.street}
                                errorMessage={errors.street?.message}
                                name="street" placeholder="Juan Ruiz de Alarcón" />
                        </div>
                        <div>
                            <LabelInput htmlFor="interiorNumber" value="Numero interior" required='no' />
                            <TextInput
                                {...register('interiorNumber')}
                                error={!!errors.interiorNumber}
                                errorMessage={errors.interiorNumber?.message}
                                name="interiorNumber" placeholder="14" />
                        </div>
                        <div>
                            <LabelInput htmlFor="exteriorNumber" value="Numero exterior" required='no' />
                            <TextInput
                                {...register('exteriorNumber')}
                                error={!!errors.exteriorNumber}
                                errorMessage={errors.exteriorNumber?.message}
                                name="exteriorNumber" placeholder="S/N" />
                        </div>
                    </div>
                </div>
                <div>
                    <LabelInput htmlFor="reference" value="Referencia adicional" required='no' />
                    <TextArea
                        {...register('reference')}
                        error={!!errors.reference}
                        errorMessage={errors.reference?.message}
                        name="reference" placeholder="Guerrero" />
                </div>
                <Button
                    type='submit'
                    color="blue"
                    disabled={isLoading}>
                    {isLoading ? <>Procesando <Spinner /></> : <>Siguiente<HiMiniArrowLongRight /></>}
                </Button>
            </form>
            <FloatMessage
                key={floatMessageState.summary}
                description={floatMessageState.description}
                summary={floatMessageState.summary}
                type={floatMessageState.type}
                isActive={floatMessageState.isActive} />
        </>
    )
}
