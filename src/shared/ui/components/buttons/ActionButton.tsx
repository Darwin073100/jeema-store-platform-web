import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'edit' | 'delete' | 'add';
    size?: 'sm' | 'md';
    disabled?: boolean;
}

export function ActionButton({ 
    children, 
    onClick, 
    variant = 'edit', 
    size = 'sm',
    disabled = false 
}: Props) {
    const getVariantClasses = () => {
        switch (variant) {
            case 'edit':
                return 'bg-yellow-500 hover:bg-yellow-600 text-white';
            case 'delete':
                return 'bg-red-500 hover:bg-red-600 text-white';
            case 'add':
                return 'bg-blue-600 hover:bg-blue-700 text-white';
            default:
                return 'bg-gray-500 hover:bg-gray-600 text-white';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'p-2 text-sm';
            case 'md':
                return 'px-4 py-2 text-base';
            default:
                return 'p-2 text-sm';
        }
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                ${getVariantClasses()}
                ${getSizeClasses()}
                rounded-lg transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2 font-medium cursor-pointer
            `}
        >
            {children}
        </button>
    );
}
