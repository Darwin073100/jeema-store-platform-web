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
        <span className={clsx(`flex items-center justify-center px-2 py-0.5 rounded-full text-${size} font-medium bg-${type}-100 text-${type}-800 border border-${type}-300`, className)}>
            <p>{children}</p>
        </span>
    )
}

export { Badge };
