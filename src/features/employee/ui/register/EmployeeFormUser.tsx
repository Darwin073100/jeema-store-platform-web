import { TextInput } from '@/ui/components/inputs';
import { LabelInput } from '@/ui/components/labels';
import React from 'react'
import { useEmployeeFormUser } from '../../infraestructure/hooks/useEmployeeFormUser';

const EmployeeFormUser = () => {
    const {onSubmit, handleSubmit, register, errors, } = useEmployeeFormUser();
    return (
        <div className="w-full">
            <h1 className="text-green-600 font-semibold bg-green-100 rounded-t-2xl p-2 text-lg uppercase text-center">Usuario para accesar al sistema</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-2xl">
                <div>
                    <LabelInput value="Nombre de usuario(Alias)" required="yes" />
                    <TextInput
                        {...register('username')}
                        error={!!errors.username}
                        errorMessage={errors.username?.message}
                        name="username" 
                        placeholder="Ej: robert54" />
                </div>
                <div>
                    <LabelInput value="Correo" required="yes" />
                    <TextInput
                        type="email"
                        {...register('email')}
                        error={!!errors.email}
                        errorMessage={errors.email?.message}
                        name="email" 
                        placeholder="Ej: roberto@email.com" />
                </div>
                <div>
                    <LabelInput value="Asignar contraseña" required="yes" />
                    <TextInput
                        type="password"
                        {...register('password')}
                        error={!!errors.password}
                        errorMessage={errors.password?.message}
                        name="password" 
                        placeholder="Ej: 9fg89hfg8f9f" />
                </div>
                <div>
                    <LabelInput value="Confirmar contraseña" required="yes" />
                    <TextInput
                        type="password"
                        {...register('passwordConfirm')}
                        error={!!errors.passwordConfirm}
                        errorMessage={errors.passwordConfirm?.message}
                        name="passwordConfirm" 
                        placeholder="Ej: 9fg89hfg8f9f" />
                </div>
            </form>
        </div>
    )
}

export { EmployeeFormUser };
