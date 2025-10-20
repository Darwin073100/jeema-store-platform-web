import { TextInput } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import React from 'react'

const EmployeeFormAddress = () => {
    return (
        <div className="w-full">
            <h1 className="text-purple-600 font-semibold bg-purple-100 rounded-t-2xl p-2 text-lg uppercase text-center">Dirección del empleado</h1>
            <div className="bg-white p-4 rounded-b-2xl">
                <div>
                    <LabelInput value="Calle" required="yes" />
                    <TextInput placeholder="Ej: Juan Ruíz de Alarcón" />
                </div>
                <div>
                    <LabelInput value="Número interior" required="no" />
                    <TextInput
                        type="text"
                        placeholder="Ej: 14" />
                </div>
                <div>
                    <LabelInput value="Número exterior" required="no" />
                    <TextInput
                        type="text"
                        placeholder="Ej: 10" />
                </div>
                <div>
                    <LabelInput value="Código postal" required="yes" />
                    <TextInput
                        type="text"
                        placeholder="Ej: 41700" />
                </div>
                <div>
                    <LabelInput value="Colonia o barrio" required="no" />
                    <TextInput
                        type="text"
                        placeholder="Ej: Barrio de la Guadalupe" />
                </div>
                <div>
                    <LabelInput value="Ciudad o municipio" required="yes" />
                    <TextInput
                        type="text"
                        placeholder="Ej: Ometepec" />
                </div>
                <div>
                    <LabelInput value="Estado" required="yes" />
                    <TextInput
                        type="text"
                        placeholder="Ej: Guerrero" />
                </div>
                <div>
                    <LabelInput value="Pais" required="yes" />
                    <TextInput
                        type="text"
                        placeholder="Ej: México" />
                </div>
            </div>
        </div>
    )
}

export { EmployeeFormAddress };
