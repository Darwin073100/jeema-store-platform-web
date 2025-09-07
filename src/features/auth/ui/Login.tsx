'use client'
import Image from 'next/image';
import logo from "src/ui/assets/images/logologo.png";
import React from 'react'
import { LabelInput } from '@/ui/components/labels';
import { TextInput } from '@/ui/components/inputs';
import Link from 'next/link';
import { Button } from '@/ui/components/buttons';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { useLogin } from '../hooks/useLogin';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { FloatMessage } from '@/ui/components/messages';

const Login = () => {
    const { handleSubmit, errors, floatMessageState, 
        isLoading, onSubmit, register,
    } = useLogin();

    return (
        <main className="py-4 flex flex-col h-screen items-center justify-center gap-4">
            <div className='bg-white shadow-xl rounded-xl pt-8'>
                <div className="flex flex-col items-center gap-4">
                    <Image
                        className="rounded-xl shadow"
                        src={logo} alt="logotipo"
                        width={150} height={150} />
                    <h1 className="text-3xl text-gray-500">Inicio de sesión</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="w-96 p-8 flex flex-col gap-4">
                        <div>
                            <LabelInput value="Correo electrónico" />
                            <TextInput
                                {...register('email')}
                                error={!!errors.email}
                                errorMessage={errors.email?.message} 
                                placeholder="Correo electrónico" />
                        </div>
                        <div>
                            <LabelInput value="Contraseña" />
                            <TextInput 
                                {...register('password')}
                                error={!!errors.password}
                                errorMessage={errors.password?.message}
                                placeholder="Contraseña" type="password" />

                            <div className="flex w-full justify-end">
                                <Link href={"#"} className="text-blue-500 hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>
                        <div>
                            <Button  className='w-full flex justify-center items-center'>
                                {isLoading ? <Spinner /> : 
                                    <>
                                        Iniciar
                                        <IoMdArrowRoundForward />
                                    </>
                                }
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <FloatMessage
                key={floatMessageState.summary}
                description={floatMessageState.description}
                summary={floatMessageState.summary}
                type={floatMessageState.type}
                isActive={floatMessageState.isActive} />
        </main>
    )
}

export { Login };
