'use client'
import clsx from "clsx"
import { forwardRef, TextareaHTMLAttributes } from 'react'

interface Props extends React.DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>{
    error?: boolean,
    errorMessage?: string,
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(({ 
    error = false, 
    errorMessage,
    className,
    ...props 
}, ref) => {
    return (
        <>
        <textarea
            ref={ref}
            className={
                clsx(
                    `text-lg block w-full rounded-xl bg-white border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-blue-600`,
                    className,
                    error && 'outline-red-600 focus:outline-red-600'
                )
            } 
            {...props}
        />
        {error && <p className='text-red-500 text-sm'>{`* ${errorMessage}`}</p>}
        </>
    );
})
