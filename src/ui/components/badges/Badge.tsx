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
        <span className={clsx(`px-2 py-0.5 rounded-full text-${size} font-medium bg-${type}-100 text-${type}-800`, className)}>
            {children}
        </span>
    )
}

export { Badge };
