import clsx from 'clsx';
import React from 'react'

interface Props {
    children?: any;
    type?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange';
    size?: 'xs'| 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

// Mapa estático — ver nota en Button.tsx sobre por qué `bg-${type}-100 text-${type}-700`
// construido en runtime no funciona con el scanner de Tailwind.
const typeClasses: Record<NonNullable<Props['type']>, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
}

const Badge = ({ children, type='blue', className, size='xs' }: Props) => {
    return (
        <span className={clsx(`flex items-center justify-center px-2 py-1 rounded-full text-${size} font-bold`, typeClasses[type], className)}>
            <p>{children}</p>
        </span>
    )
}

export { Badge };
