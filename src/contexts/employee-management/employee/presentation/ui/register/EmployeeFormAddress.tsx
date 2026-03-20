import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import React from 'react'

interface Props {
    register: any,
    errors: any,
}
const EmployeeFormAddress = ({ errors, register }: Props) => {
    return (
        <div className="w-full">
            <h1 className="text-purple-600 font-semibold bg-purple-100 rounded-t-2xl p-2 text-lg uppercase text-center">Dirección del empleado</h1>
            <div className="bg-white p-4 rounded-b-2xl">
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
            </div>
        </div>
    )
}

export { EmployeeFormAddress };
