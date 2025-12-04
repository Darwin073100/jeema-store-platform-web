import Link from 'next/link'
import React from 'react'
import { IoAdd } from 'react-icons/io5'

interface Props{
    valueDescription: string,
    value: string,
    noteDescription: string,
    note: string
}

export const CardPrimary = ({valueDescription, value, noteDescription, note}: Props) => {
    return (
        <Link href='#' className="bg-white shadow-xl rounded-2xl p-4 flex flex-col gap-1.5 max-w-80 transition-all duration-300 hover:bg-gray-200">
            <span>{valueDescription}</span>
            <div className='text-blue-600 font-bold text-2xl flex items-center justify-between'>
                <h2>{value}</h2>
                <span className=''><IoAdd /></span>
            </div>
            <div className='text-sm flex gap-2 items-center'>
                <span className='bg-green-100 text-green-700 font-semibold p-2 rounded-2xl'>{ note }</span>
                <span>{noteDescription}</span>
            </div>
        </Link>
    )
}
