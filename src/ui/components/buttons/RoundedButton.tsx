'use client'
import clsx from 'clsx'
import React, { JSX } from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: JSX.Element | string | JSX.Element[],
    color?: 'blue'|'green'|'yellow'|'red'|'gray'
}

export const RoundedButton = ({ children, color = 'blue' , ...props }: Props) => {
    return (
        <button
            className={
                clsx(`transition-all duration-500 cursor-pointer bg-${color}-500 text-white p-2 rounded-full flex items-center justify-center w-8 h-8`,
                    props.className,
                    color && `hover:bg-${color}-600`,
                )}
            {...props}   >
            { children }
        </button>
    )
}
