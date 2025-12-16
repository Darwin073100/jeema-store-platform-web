'use client'
import React from 'react'
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { BsBackspaceFill } from "react-icons/bs";
import Link from 'next/link'
import { Button } from '../buttons'
import { FcSearch } from 'react-icons/fc';
interface Props {
    title?: string,
    description?: string,
    linkText?: string,
    linkHref: string,
}
const TemplateNotFoundDinamic = ({ 
    title='¡El recurso solicitado no se encontro!.',
    description = 'Asegurate de que la ruta sea la correcta.', 
    linkHref, 
    linkText ='Volver', 
}: Props) => {
  return (
     <ProtectedRoute>
        <main className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50 p-4">
            <div className="bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-300 text-red-800 px-6 py-8 rounded-xl shadow-lg text-center">
                <div className="text-8xl mb-4 flex justify-center"><FcSearch/></div>
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-red-700">{description}</p>
                <div className="mt-6">
                    <Link href={linkHref}>
                        <Button color="red">
                            <BsBackspaceFill /> {linkText}
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    </ProtectedRoute>
  )
}

export default TemplateNotFoundDinamic
