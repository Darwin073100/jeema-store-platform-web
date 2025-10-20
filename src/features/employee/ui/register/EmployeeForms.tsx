'use client'
import { SelectMenu, SelectMenuOption, TextInput } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import React from 'react'
import { useEmployeeUIStore } from '../../infraestructure/stores/employee-ui.store';
import clsx from 'clsx';
import { EmployeeFormAddress } from './EmployeeFormAddress';
import { EmployeeFormUser } from './EmployeeFormUser';
import { GenderEnum } from '../../domain/enums/gender.enum';

interface Props {
    optionsRoles: SelectMenuOption[]
}

const EmployeeForms = ({ optionsRoles }: Props) => {
    const genderOptions = Object.values(GenderEnum).map(item => ({text: item.toUpperCase(), value: item}));

    const { addressStateCheck, userStateCheck} = useEmployeeUIStore()
    return (
        <div className="flex gap-4 w-full">
            <div className="w-full">
                <h1 className="text-blue-600 font-semibold bg-blue-100 rounded-t-2xl p-2 text-lg uppercase text-center">Información del empleado</h1>
                <div className="bg-white p-4 rounded-b-2xl">
                    <div>
                        <LabelInput value="Nombre" required="yes" />
                        <TextInput placeholder="Introduce el nombre" />
                    </div>
                    <div>
                        <LabelInput value="Apellidos" required="yes" />
                        <TextInput placeholder="Introduce los apellidos" />
                    </div>
                    <div>
                        <LabelInput value="Típo de empleado" required="yes" />
                        <SelectMenu items={optionsRoles} />
                    </div>
                    <div>
                        <LabelInput value="Número de teléfono" required="yes" />
                        <TextInput
                            type="tel"
                            placeholder="Introduce no de teléfono" />
                    </div>
                    <div>
                        <LabelInput value="Correo" required="no" />
                        <TextInput
                            type="email"
                            placeholder="Introduce un correo" />
                    </div>
                    <div>
                        <LabelInput value="Fécha de nacimiento" required="no" />
                        <TextInput
                            type="date"
                            placeholder="Fecha de nacimiento" />
                    </div>
                    <div>
                        <LabelInput value="Genero" required="no" />
                        <SelectMenu items={genderOptions} />
                    </div>
                    <div>
                        <LabelInput value="Fécha de contratación" required="no" />
                        <TextInput
                            type="date"
                            placeholder="Selecciona" />
                    </div>
                    <div>
                        <LabelInput value="Hora de entrada" required="no" />
                        <TextInput
                            type="time"
                            placeholder="Selecciona" />
                    </div>
                    <div>
                        <LabelInput value="Hora de salida" required="no" />
                        <TextInput
                            type="time"
                            placeholder="Selecciona" />
                    </div>
                    <div>
                        <LabelInput value="Salario por día" required="no" />
                        <TextInput
                            min={0.0}
                            type="number"
                            placeholder="Selecciona" />
                    </div>
                </div>
            </div>
            <div className={clsx(`${(!userStateCheck && !addressStateCheck) && 'hidden'} w-full flex flex-col gap-4`)}>
                {userStateCheck && <>
                    <EmployeeFormUser />
                </>}
                {addressStateCheck && <>
                    <EmployeeFormAddress />
                </>}
            </div>
        </div>
    )
}

export { EmployeeForms };
