'use client'
import clsx from 'clsx'
import React, { JSX } from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: JSX.Element | string | JSX.Element[],
    color?: 'blue'|'green'|'yellow'|'red'|'gray'
}

// Mapa estático — ver nota en Button.tsx sobre por qué `bg-${color}-500` construido en runtime no
// funciona con el scanner de Tailwind.
const colorClasses: Record<NonNullable<Props['color']>, string> = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    red: 'bg-red-500 hover:bg-red-600',
    gray: 'bg-gray-500 hover:bg-gray-600',
}

export const RoundedButton = ({ children, color = 'blue' , ...props }: Props) => {
    return (
        <button
            className={
                clsx(`transition-all duration-500 cursor-pointer text-white p-2 rounded-full flex items-center justify-center w-8 h-8`,
                    colorClasses[color],
                    props.className,
                )}
            {...props}   >
            { children }
        </button>
    )
}
