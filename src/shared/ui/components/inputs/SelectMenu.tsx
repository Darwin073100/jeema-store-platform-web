'use client'
import clsx from 'clsx'
import React from 'react'

export type SelectMenuOption = {
    value : string,
    text: string,
    additional?: string,
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement>{
    error?: boolean,
    errorMessage?: string,
    items: SelectMenuOption[]
}

export const SelectMenu = ({ error = false, errorMessage, items ,...props }: Props) => {
    return (
        <>
        <select className={
                        clsx(
                            `mt-1 block w-full rounded-xl text-lg bg-white border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-blue-600`,
                            props.className,
                            error && 'outline-red-600 focus:outline-red-600'
                        )
                    } {...props}>
            <option value="">Selecciona una opción</option>
            { items?.map(option => (
                <option key={ option.value } value={option.value}> { option.text } </option>
            ))}
        </select>
        {error && <p className='text-red-500 text-sm'>{`* ${errorMessage}`}</p>}
        </>
        
    )
}
