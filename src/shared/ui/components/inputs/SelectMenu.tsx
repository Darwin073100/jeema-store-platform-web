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
    items: SelectMenuOption[],
    /** Texto de la opción vacía (value ""). `null` la oculta. */
    placeholder?: string | null,
}

export const SelectMenu = ({ error = false, errorMessage, items, placeholder = 'Selecciona una opción', ...props }: Props) => {
    return (
        <>
        <select className={
                        clsx(
                            `mt-1 block w-full rounded-xl text-lg bg-white border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-blue-600`,
                            props.className,
                            error && 'outline-red-600 focus:outline-red-600'
                        )
                    } {...props}>
            {placeholder !== null && <option value="">{placeholder}</option>}
            { items?.map(option => (
                <option key={ option.value } value={option.value}> { option.text } </option>
            ))}
        </select>
        {error && <p className='text-red-500 text-sm'>{`* ${errorMessage}`}</p>}
        </>
        
    )
}
