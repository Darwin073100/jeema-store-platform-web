'use client'
import React from 'react'
import { useCustomerUIStore } from '../../stores/customer-ui.store'
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Button } from '@/shared/ui/components/buttons';
import { SelectMenu, TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { useCustomerUpdateModal } from '../../hooks/useCustomerUpdateModal';
import { IoSave } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';

const CustomerUpdateModal = () => {
    const { customerModal, closeCustomerModal } = useCustomerUIStore();
    const { customerTypeOptions, errors, handleSubmit, loading, onSubmit, register} = useCustomerUpdateModal();
    return (
        <TemplateModal isOpen={customerModal === 'editCustomer'} onClose={closeCustomerModal}>
            <form onSubmit={handleSubmit(onSubmit)} className='p-4'>
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
                        placeholder='Nombre de la empresa o negocio' />
                </div>
                <div>
                    <LabelInput value="RFC de la empresa o negocio" required="no" />
                    <TextInput
                        {...register('rfc')}
                        error={!!errors.rfc}
                        errorMessage={errors.rfc?.message}
                        name="rfc"
                        placeholder='RFC de la empresa o negocio' />
                </div>

                <Button type='submit' className='w-full mt-4' disabled={loading === 'editCustomer'}>
                    {loading === 'editCustomer' ? <Spinner /> : <IoSave />}
                    Guradar cambios
                </Button>
            </form>
        </TemplateModal>
    )
}

export { CustomerUpdateModal };
