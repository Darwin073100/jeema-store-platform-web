import clsx from 'clsx';
import React from 'react'

interface Props {
    children?: any;
    type?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
    size?: 'xs'| 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const Badge = ({ children, type='blue', className, size='xs' }: Props) => {
    return (
        <span className={clsx(`flex items-center justify-center px-2 py-1 rounded-full text-${size} font-bold bg-${type}-50 text-${type}-400`, className)}>
            <p>{children}</p>
        </span>
    )
}

export { Badge };
