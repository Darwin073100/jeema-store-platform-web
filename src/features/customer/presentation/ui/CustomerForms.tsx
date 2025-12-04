'use client'
import React from 'react'
import clsx from 'clsx';
import { SelectMenu, TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { Button } from '@/shared/ui/components/buttons';
import { FloatMessage } from '@/shared/ui/components/messages';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { IoSave } from 'react-icons/io5';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { CustomerFormAddress } from './CustomerFormAddress';
import { CustomerEnableOptios } from './CustomerEnableOptios';

const CustomerForms = () => {
    const { errors, onSubmit, register, handleSubmit, addressCheck, floatMessageState, loading, customerTypeOptions } = useCustomerForm()
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <CustomerEnableOptios register={register}/>
            <div className="flex gap-4 w-full">
                <div className="w-full">
                    <h1 className="text-blue-600 font-semibold bg-blue-100 rounded-t-2xl p-2 text-lg uppercase text-center">Información del cliente</h1>
                    <div className="bg-white p-4 rounded-b-2xl">
                        <div className=' flex items-center gap-4 bg-amber-100 rounded-xl p-2 shadow-md'>
                            <LabelInput value="Habilitar para usarlo por defecto en ventas" />
                            <input type='checkbox' {...register('saleDefault')} name="saleDefault" id="saleDefault"
                                className='w-5 h-5' />
                        </div>
                        <div>
                            <LabelInput value="Nombre" required="yes" />
                            <TextInput
                                {...register('firstName')}
                                type='text'
                                error={!!errors.firstName}
                                errorMessage={errors.firstName?.message}
                                name="firstName"
                                placeholder="Ej: Roberto" />
                        </div>
                        <div>
                            <LabelInput value="Apellidos" required="yes" />
                            <TextInput
                                {...register('lastName')}
                                type='text'
                                error={!!errors.lastName}
                                errorMessage={errors.lastName?.message}
                                name="lastName"
                                placeholder="Ej: Bustos Quiterio" />
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
                            <LabelInput value="Típo de cliente" required="no" />
                            <SelectMenu
                                {...register('customerType')}
                                error={!!errors.customerType}
                                errorMessage={errors.customerType?.message}
                                name="customerType"
                                items={customerTypeOptions} />
                        </div>
                        <div>
                            <LabelInput value="Nombre de la empresa o negocio" required="no" />
                            <TextInput
                                {...register('companyName')}
                                error={!!errors.companyName}
                                errorMessage={errors.companyName?.message}
                                name="companyName"
                                placeholder='Nombre de la empresa o negocio'/>
                        </div>

                        <Button type='submit' className='w-full mt-4' disabled={loading === 'saveCustomer'}>
                            {loading === 'saveCustomer' ? <Spinner/>: <IoSave/>}
                            Guradar
                        </Button>
                    </div>
                </div>
                <div className={clsx(`${(!addressCheck) && 'hidden'} w-full flex flex-col gap-4`)}>
                    {addressCheck && <>
                        <CustomerFormAddress 
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

export { CustomerForms };
