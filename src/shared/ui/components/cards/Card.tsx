import clsx from 'clsx';
import React from 'react'
interface Props {
    children?: any,
    className?: string,
    onClick?: React.MouseEventHandler<HTMLElement>,
}
const Card = ({ className, children, onClick }: Props) => {
    return (
        <article onClick={onClick} className={clsx(`bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500`, className)}>
            {children}
        </article>
    )
}

export { Card };
