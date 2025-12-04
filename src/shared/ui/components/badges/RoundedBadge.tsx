'use client'
import clsx from 'clsx'
import React, { JSX } from 'react'

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    children?: JSX.Element | string | JSX.Element[],
    color?: 'blue'|'green'|'yellow'|'red'|'gray'
}

export const RoundedBadge = ({ children, color = 'blue' , ...props }: Props) => {
    return (
        <span
            className={
                clsx(`bg-${color}-500 text-white p-2 rounded-full flex items-center justify-center w-8 h-8`,
                    props.className,
                )}
            {...props}   >
                <span></span>
            { children }
        </span>
    )
}
