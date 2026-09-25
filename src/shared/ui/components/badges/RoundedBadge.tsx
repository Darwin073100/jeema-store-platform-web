'use client'
import clsx from 'clsx'
import React, { JSX } from 'react'

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    children?: JSX.Element | string | JSX.Element[],
    color?: 'blue'|'green'|'yellow'|'red'|'gray'
}

// Mapa estático — ver nota en Button.tsx sobre por qué `bg-${color}-500` construido en runtime no
// funciona con el scanner de Tailwind.
const colorClasses: Record<NonNullable<Props['color']>, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500',
}

export const RoundedBadge = ({ children, color = 'blue' , ...props }: Props) => {
    return (
        <span
            className={
                clsx(`text-white p-2 rounded-full flex items-center justify-center w-8 h-8`,
                    colorClasses[color],
                    props.className,
                )}
            {...props}   >
                <span></span>
            { children }
        </span>
    )
}
