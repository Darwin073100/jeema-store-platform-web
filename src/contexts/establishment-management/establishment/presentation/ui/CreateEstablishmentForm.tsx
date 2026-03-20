'use client'
import React, { useEffect, useState } from 'react'
import { TextInput } from '../../../../../shared/ui/components/inputs'
import { Button } from '../../../../../shared/ui/components/buttons'
import { HiMiniArrowLongRight } from 'react-icons/hi2'
import { createEstablishmentAction } from '@/contexts/establishment-management/establishment/presentation/actions/create.establishment.action'
import { useRouter } from 'next/navigation'
import { Spinner } from '../../../../../shared/ui/components/loadings/Spinner'
import { FloatMessage } from '../../../../../shared/ui/components/messages'
import { FloatMessageType } from '@/shared/ui/types/FloatMessageType'
import * as yup from 'yup';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEstablishmentStore } from '../stores/establishment.store'
import { CreateEstablishmentDTO } from '../../../../../features/establishment/application/dtos/create-establishment.dto'
import { useBranchOfficeStore } from '@/contexts/establishment-management/branch-office/presentation/stores/branch-office.store'

const schema = yup.object({
    name: yup.string().required('El campo nombre es requerido').min(3, 'El valor debe ser mayor a 3 caracteres')
}).required();

type FormData = yup.InferType< typeof schema>

export const CreateEstablishmentForm = () => {

    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    // const { setEstablishment, establishment } = useEstablishmentStore();
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState(false);
    const { setEstablishment, clearEstablishment } = useEstablishmentStore();
    const { clearBranchOffice } = useBranchOfficeStore();
    
    useEffect(()=>{
        clearEstablishment();
        clearBranchOffice();
    },[]);

    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        setFloatMessageState(()=>({}));
        setIsLoading(true);

        const dto: CreateEstablishmentDTO = {
            name: data.name
        }

        let resp;
        resp = await createEstablishmentAction(dto);

        if (resp?.ok) {
            setFloatMessageState(()=>({
                description: 'Establecimiento creado correctamente',
                summary: '¡Correcto!',
                isActive: true,
                type: 'green'
            }));
            
            resp.value ? setEstablishment(resp.value): null;

            router.push('/initial/first-branch-office')
        } else {
            setIsLoading(false);
            setFloatMessageState(()=>({
                description: resp?.error?.message,
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            }));            
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-md flex flex-col gap-4 max-w-[450px]">
                <h1 className="text-lg text-center">
                    ¡Debes ingresar el nombre de tu establecimiento!
                </h1>
                <TextInput
                    {...register("name")}
                    name='name'
                    error={ !!errors.name }
                    type="text"
                    placeholder="Introduce el nombre"
                    errorMessage={errors.name?.message} />
                <Button
                    type='submit'
                    color="blue">
                    {isLoading ?<>Procesando <Spinner /></> : <>Siguiente<HiMiniArrowLongRight /></>}
                </Button>
            </form>
            <FloatMessage 
                key={floatMessageState.summary}
                description={floatMessageState.description}
                summary={floatMessageState.summary}
                type={ floatMessageState.type}
                isActive={ floatMessageState.isActive}/>
        </>
    )
}
