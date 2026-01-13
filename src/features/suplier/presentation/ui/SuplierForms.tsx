'use client'
import React from 'react'
import clsx from 'clsx';
import { SelectMenu, TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Button } from '@/shared/ui/components/buttons';
import { FloatMessage } from '@/shared/ui/components/messages';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { IoSave } from 'react-icons/io5';
import { useSuplierForm } from '../hooks/useSuplierForm';
import { TextArea } from '@/shared/ui/components/inputs/TextInput copy';
import { SuplierEnableOptios } from './SuplierEnableOptios';
import { SuplierFormAddress } from './SuplierFormAddress';

const SuplierForms = () => {
    const { errors, onSubmit, register, handleSubmit, addressCheck, floatMessageState, loading } = useSuplierForm()
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <SuplierEnableOptios register={register}/>
            <div className="flex gap-4 w-full">
                <div className="w-full">
                    <h1 className="text-blue-600 font-semibold bg-blue-100 rounded-t-2xl p-2 text-lg uppercase text-center">Información del proveedor</h1>
                    <div className="bg-white p-4 rounded-b-2xl">
                        <div>
                            <LabelInput value="Nombre del proveedor" required="yes" />
                            <TextInput
                                {...register('name')}
                                type='text'
                                error={!!errors.name}
                                errorMessage={errors.name?.message}
                                name="name"
                                placeholder="Ej: Chedraui Ometepec" />
                        </div>
                        <div>
                            <LabelInput value="Persona de contacto" required="no" />
                            <TextInput
                                {...register('contactPerson')}
                                type='text'
                                error={!!errors.contactPerson}
                                errorMessage={errors.contactPerson?.message}
                                name="contactPerson"
                                placeholder="Ej: Fernano Marin Garcia" />
                        </div>
                        <div>
                            <LabelInput value="Número de teléfono" required="no" />
                            <TextInput
                                {...register('phoneNumber')}
                                type="tel"
                                error={!!errors.phoneNumber}
                                errorMessage={errors.phoneNumber?.message}
                                name="phoneNumber"
                                placeholder="Ej: 7417682345" />
                        </div>
                        <div>
                            <LabelInput value="Correo" required="no" />
                            <TextInput
                                {...register('email')}
                                type="email"
                                error={!!errors.email}
                                errorMessage={errors.email?.message}
                                name="email"
                                placeholder="Ej: roberto@email.com" />
                        </div>
                        <div>
                            <LabelInput value="Ingresa el RFC del proveedor" required="no" />
                            <TextInput
                                {...register('rfc')}
                                error={!!errors.rfc}
                                errorMessage={errors.rfc?.message}
                                name="rfc"
                                placeholder='Ingresa el RFC del proveedor'/>
                        </div>
                        <div>
                            <LabelInput value="Nota o comentario" required="no" />
                            <TextArea
                                {...register('notes')}
                                error={!!errors.notes}
                                errorMessage={errors.notes?.message}
                                name="notes"
                                placeholder='Este proveedor es mayorista.'/>
                        </div>

                        <Button type='submit' className='w-full mt-4' disabled={loading === 'saveSuplier'}>
                            {loading === 'saveSuplier' ? <Spinner/>: <IoSave/>}
                            Guradar
                        </Button>
                    </div>
                </div>
                <div className={clsx(`${(!addressCheck) && 'hidden'} w-full flex flex-col gap-4`)}>
                    {addressCheck && <>
                        <SuplierFormAddress 
                            register={register}
                            errors={errors}/>
                    </>}
                </div>
            </div>
            <FloatMessage
                {...floatMessageState} />
        </form>
    )
}

export { SuplierForms };
