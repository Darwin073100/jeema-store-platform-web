'use client'
import { SelectMenu, SelectMenuOption, TextInput } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import React from 'react'
import { useEmployeeUIStore } from '../../infraestructure/stores/employee-ui.store';
import clsx from 'clsx';
import { EmployeeFormAddress } from './EmployeeFormAddress';
import { EmployeeFormUser } from './EmployeeFormUser';
import { GenderEnum } from '../../domain/enums/gender.enum';
import { useEmployeeForm } from '../../infraestructure/hooks/useEmployeeForm';
import { Button } from '@/ui/components/buttons';

interface Props {
    optionsRoles: SelectMenuOption[]
}

const EmployeeForms = ({ optionsRoles }: Props) => {
    const genderOptions = Object.values(GenderEnum).map(item => ({text: item.toUpperCase(), value: item}));

    const { addressStateCheck, userStateCheck, errors, onSubmit, register, handleSubmit} = useEmployeeForm()
    return (
        <div className="flex gap-4 w-full">
            <div className="w-full">
                <h1 className="text-blue-600 font-semibold bg-blue-100 rounded-t-2xl p-2 text-lg uppercase text-center">Información del empleado</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
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
                        <LabelInput value="Típo de empleado" required="yes" />
                        <SelectMenu 
                            {...register('employeeRoleId')}
                            error={!!errors.employeeRoleId}
                            errorMessage={errors.employeeRoleId?.message}
                            name="employeeRoleId"
                            items={optionsRoles} />
                    </div>
                    <div>
                        <LabelInput value="Número de teléfono" required="yes" />
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
                        <LabelInput value="Fécha de nacimiento" required="no" />
                        <TextInput
                            type="date"
                            {...register('birthDate')}
                            error={!!errors.birthDate}
                            errorMessage={errors.birthDate?.message}
                            name="birthDate"
                            placeholder="Fecha de nacimiento" />
                    </div>
                    <div>
                        <LabelInput value="Genero" required="no" />
                        <SelectMenu 
                            {...register('gender')}
                            error={!!errors.gender}
                            errorMessage={errors.gender?.message}
                            name="gender"
                            items={genderOptions} />
                    </div>
                    <div>
                        <LabelInput value="Fécha de contratación" required="no" />
                        <TextInput
                            type="date"
                            {...register('hireDate')}
                            error={!!errors.hireDate}
                            errorMessage={errors.hireDate?.message}
                            name="hireDate"
                            placeholder="Selecciona" />
                    </div>
                    <div>
                        <LabelInput value="Hora de entrada" required="no" />
                        <TextInput
                            type="time"
                            {...register('entryTime')}
                            error={!!errors.entryTime}
                            errorMessage={errors.entryTime?.message}
                            name="entryTime"
                            placeholder="Selecciona" />
                    </div>
                    <div>
                        <LabelInput value="Hora de salida" required="no" />
                        <TextInput
                            type="time"
                            {...register('exitTime')}
                            error={!!errors.exitTime}
                            errorMessage={errors.exitTime?.message}
                            name="exitTime"
                            placeholder="Selecciona" />
                    </div>
                    <div>
                        <LabelInput value="Salario por día" required="no" />
                        <TextInput
                            min={0.0}
                            type="number"
                            {...register('currentSalary')}
                            error={!!errors.currentSalary}
                            errorMessage={errors.currentSalary?.message}
                            name="currentSalary"
                            placeholder="Ej: 200" />
                    </div>
                    <Button type='submit'>
                        Guardar
                    </Button>
                </form>
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
