'use client'
import clsx from "clsx"
interface Props extends React.InputHTMLAttributes<HTMLInputElement>{
    type?: 'text'|'password'|'email'|'tel'|'url'|'search'|'number'|'date'|'radio',
    error?: boolean,
    errorMessage?: string,
}

export const TextInput = ({ type, error = false, errorMessage ,...props }: Props) => {
    return (
        <>
        <input
            type={type ?? "text"}
            className={
                clsx(
                    `text-lg mt-1 block w-full rounded-xl bg-white border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-blue-600`,
                    // `block w-full rounded-md bg-white px-4 py-2 text-gray-700 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600`,
                    props.className,
                    error && 'outline-red-600 focus:outline-red-600'
                )
            } 
            {...props}
        />
        {error && <p className='text-red-500 text-sm'>{`* ${errorMessage}`}</p>}
        </>
    )
}
