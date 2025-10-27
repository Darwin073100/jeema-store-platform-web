import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
    title: string;
    description: string;
    image: any;
    to: string;
}

export const CardLink = ({ title, description, image, to }:Props) => {
    return (
        <Link href={ to } className="transition-all duration-300 bg-white hover:bg-gray-100 rounded-xl p-4 shadow-xl flex flex-col max-md:flex-row items-center justify-center gap-1">
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
        </Link>
    )
}
