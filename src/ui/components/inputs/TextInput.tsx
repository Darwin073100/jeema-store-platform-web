'use client'
import clsx from "clsx"
import { forwardRef } from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement>{
    type?: 'text'|'password'|'email'|'tel'|'url'|'search'|'number'|'date'|'radio',
    error?: boolean,
    errorMessage?: string,
}

export const TextInput = forwardRef<HTMLInputElement, Props>(({ 
    type, 
    error = false, 
    errorMessage,
    ...props 
}, ref) => {
    return (
        <>
        <input
            ref={ref}
            type={type ?? "text"}
            className={
                clsx(
                    `text-lg block w-full rounded-xl bg-white border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-blue-600`,
                    props.className,
                    error && 'outline-red-600 focus:outline-red-600'
                )
            } 
            {...props}
        />
        {error && <p className='text-red-500 text-sm'>{`* ${errorMessage}`}</p>}
        </>
    );
})
