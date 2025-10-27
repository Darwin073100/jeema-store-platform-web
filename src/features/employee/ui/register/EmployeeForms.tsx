'use client'
import React from 'react'
import clsx from 'clsx';
import { SelectMenu, SelectMenuOption, TextInput } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import { EmployeeFormAddress } from './EmployeeFormAddress';
import { GenderEnum } from '../../domain/enums/gender.enum';
import { useEmployeeForm } from '../../infraestructure/hooks/useEmployeeForm';
import { Button } from '@/ui/components/buttons';
import { EmployeeEnableOptios } from './EmployeeEnableOptios';
import { RoleEntity } from '@/features/auth/domain/entities/role.entity';
import { FloatMessage } from '@/ui/components/messages';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { IoSave } from 'react-icons/io5';

interface Props {
    optionsRoles: SelectMenuOption[],
    userRoles: RoleEntity[],
}

const EmployeeForms = ({ optionsRoles, userRoles }: Props) => {
    const genderOptions = Object.values(GenderEnum).map(item => ({ text: item.toUpperCase(), value: item }));

    const { errors, onSubmit, register, handleSubmit, userCheck, addressCheck, floatMessageState, loading } = useEmployeeForm()
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <EmployeeEnableOptios register={register}/>
            <div className="flex gap-4 w-full">
                <div className="w-full">
                    <h1 className="text-blue-600 font-semibold bg-blue-100 rounded-t-2xl p-2 text-lg uppercase text-center">Información del empleado</h1>
                    <div className="bg-white p-4 rounded-b-2xl">
                        {/* <input type="checkbox" {...register('userCheck')} name="userCheck" id="userCheck" /> */}
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
                        <Button type='submit' className='w-full mt-4' disabled={loading}>
                            {loading? <Spinner/>: <IoSave/>}
                            Guradar
                        </Button>
                    </div>
                </div>
                <div className={clsx(`${(!userCheck && !addressCheck) && 'hidden'} w-full flex flex-col gap-4`)}>
                    {/* {userCheck && <>
                        <EmployeeFormUser 
                            userRoles={userRoles}
                            register={register}
                            errors={errors}/>
                    </>} */}
                    {addressCheck && <>
                        <EmployeeFormAddress 
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

export { EmployeeForms };
