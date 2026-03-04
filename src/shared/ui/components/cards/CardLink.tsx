'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Spinner } from '../loadings/Spinner';

interface Props {
    title: string;
    description: string;
    image: any;
    to: string;
}

export const CardLink = ({ title, description, image, to }:Props) => {
    const [redirect, setRedirect] = React.useState(false);
    return (
        <Link href={ to } className="relative transition-all duration-300 bg-white rounded-xl p-4 shadow-xl flex flex-col max-md:flex-row items-center justify-center gap-1 hover:bg-blue-200 border-2 border-white hover:border-2 hover:border-blue-700">
            <Image
                src={ image }
                alt={ title }
                width={100}
                height={100}
            />
            <div className="flex flex-col justify-center items-center w-full">
                <h2 className="text-2xl font-bold">{ title }</h2>
                <span className='text-center'>{ description }</span>
            </div>
            <div className='absolute h-full w-full z-10' onClick={()=> setRedirect(true)}>
                {redirect && <Spinner color='gray' className='relative top-2 left-2'/>}
            </div>
        </Link>
    )
}
