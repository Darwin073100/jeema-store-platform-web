import { ReactNode } from 'react';

interface Props {
    label: string;
    value: string | ReactNode;
    icon?: ReactNode;
    className?: string;
}

export function InfoCard({ label, value, icon, className = '' }: Props) {
    return (
        <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-center gap-2 mb-1">
                {icon && <span className="text-gray-600">{icon}</span>}
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {label}
                </label>
            </div>
            <div className="text-gray-900 font-semibold">
                {value}
            </div>
        </div>
    );
}
