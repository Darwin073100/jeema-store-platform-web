'use client'
import React from 'react'
import { TemplateModal } from '@/shared/ui/components/modals/TemplateModal';
import { Button } from '@/shared/ui/components/buttons';
import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { IoSave } from 'react-icons/io5';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useEmployeeUIStore } from '../../stores/employee-ui.store';
import { useEmployeeAddAddressModal } from '../../hooks/hooks/useEmployeeAddAddressModal';

const EmployeeAddAddressModal = () => {
    const { employeeModal, closeEmployeeModal } = useEmployeeUIStore();
    const { errors, handleSubmit, loading, onSubmit, register } = useEmployeeAddAddressModal();
    return (
        <TemplateModal isOpen={employeeModal === 'addAddress'} onClose={closeEmployeeModal} title='Registro de dirección'>
            <form onSubmit={handleSubmit(onSubmit)} className='p-4'>
                <div>
                    <LabelInput value="Pais" required="yes" />
                    <TextInput
                        type="text"
                        {...register('addressCountry')}
                        error={!!errors.addressCountry}
                        errorMessage={errors.addressCountry?.message}
                        name="addressCountry"
                        placeholder="Ej: México" />
                </div>
                <div>
                    <LabelInput value="Estado" required="yes" />
                    <TextInput
                        type="text"
                        {...register('addressState')}
                        error={!!errors.addressState}
                        errorMessage={errors.addressState?.message}
                        name="addressState"
                        placeholder="Ej: Guerrero" />
                </div>
                <div>
                    <LabelInput value="Municipio" required="yes" />
                    <TextInput
                        type="text"
                        {...register('addressMunicipality')}
                        error={!!errors.addressMunicipality}
                        errorMessage={errors.addressMunicipality?.message}
                        name="addressMunicipality"
                        placeholder="Ej: Azoyú" />
                </div>
                <div>
                    <LabelInput value="Código postal" required="yes" />
                    <TextInput
                        type="text"
                        {...register('addressPostalCode')}
                        error={!!errors.addressPostalCode}
                        errorMessage={errors.addressPostalCode?.message}
                        name="addressPostalCode"
                        placeholder="Ej: 41916" />
                </div>
                <div>
                    <LabelInput value="Ciudad" required="yes" />
                    <TextInput
                        type="text"
                        {...register('addressCity')}
                        error={!!errors.addressCity}
                        errorMessage={errors.addressCity?.message}
                        name="addressCity"
                        placeholder="Ej: Huehuetan" />
                </div>
                <div>
                    <LabelInput value="Colonia o barrio" required="no" />
                    <TextInput
                        type="text"
                        {...register('addressNighborhood')}
                        error={!!errors.addressNighborhood}
                        errorMessage={errors.addressNighborhood?.message}
                        name="addressNighborhood"
                        placeholder="Ej: Barrio de la salida" />
                </div>
                <div>
                    <LabelInput value="Calle" required="no" />
                    <TextInput
                        type='text'
                        {...register('addressStreet')}
                        error={!!errors.addressStreet}
                        errorMessage={errors.addressStreet?.message}
                        name="addressStreet"
                        placeholder="Ej: Juan Ruíz de Alarcón" />
                </div>
                <div>
                    <LabelInput value="Número interior" required="no" />
                    <TextInput
                        type="text"
                        {...register('addressInteriorNumber')}
                        error={!!errors.addressInteriorNumber}
                        errorMessage={errors.addressInteriorNumber?.message}
                        name="addressInteriorNumber"
                        placeholder="Ej: 14" />
                </div>
                <div>
                    <LabelInput value="Número exterior" required="no" />
                    <TextInput
                        type="text"
                        {...register('addressExteriorNumber')}
                        error={!!errors.addressExteriorNumber}
                        errorMessage={errors.addressExteriorNumber?.message}
                        name="addressExteriorNumber"
                        placeholder="Ej: 10" />
                </div>
                <div>
                    <LabelInput value="Referencia" required="no" />
                    <TextInput
                        type="text"
                        {...register('addressReference')}
                        error={!!errors.addressReference}
                        errorMessage={errors.addressReference?.message}
                        name="addressReference"
                        placeholder="Ej: Frente al deportivo" />
                </div>
                <Button type='submit' className='w-full mt-4' disabled={loading === 'addAddress'}>
                    {loading === 'addAddress' ? <Spinner /> : <IoSave />}
                    Guradar
                </Button>
            </form>
        </TemplateModal>
    )
}

export { EmployeeAddAddressModal };
