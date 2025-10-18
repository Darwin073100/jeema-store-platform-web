'use client'
import Link from 'next/link';
import React from 'react'
import { FcConferenceCall, FcReadingEbook } from 'react-icons/fc';

const ConfigurationOptions = () => {
    return (
        <div className="grid grid-cols-3 gap-2">
            <div className="transition-all duration-200 cursor-pointer shadow hover:shadow-xl flex flex-col items-center justify-center bg-white p-4 w-[150px] rounded-2xl">
                <FcReadingEbook className="w-[50px] h-[50px]" />
                <span>Mi perfil</span>
            </div>
            <Link href='/configurations/users'>
                <div className="transition-all duration-200 cursor-pointer shadow hover:shadow-xl flex flex-col items-center justify-center bg-white p-4 w-[150px] rounded-2xl">
                    <FcConferenceCall className="w-[50px] h-[50px]" />
                    <span>Usuarios</span>
                </div>
            </Link>
        </div>
    )
}

export { ConfigurationOptions };
