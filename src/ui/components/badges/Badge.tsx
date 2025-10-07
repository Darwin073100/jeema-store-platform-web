import clsx from 'clsx';
import React from 'react'

interface Props {
    children?: any,
    type?: 'blue' | 'green' | 'yellow' | 'red' | 'gray',
    className?: string;
}

const Badge = ({ children, type='blue', className }: Props) => {
    return (
        <span className={clsx(`px-2 py-0.5 rounded-full text-xs font-medium bg-${type}-100 text-${type}-800`, className)}>
            {children}
        </span>
    )
}

export { Badge };
