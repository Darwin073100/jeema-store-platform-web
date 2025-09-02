'use client';
import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface RadioInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: boolean;
    errorMessage?: string;
}

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
    ({ label, error = false, errorMessage, id, className, ...props }, ref) => {
        const inputId = id || (label ? `radio-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
        return (
            <div className="flex flex-col gap-1">
                <label className="inline-flex items-center cursor-pointer gap-2" htmlFor={inputId}>
                    <input
                        ref={ref}
                        id={inputId}
                        type="radio"
                        className={clsx(
                            'accent-blue-600',
                            'focus:ring-2 focus:ring-blue-500 focus:outline-blue-600',
                            'disabled:opacity-50',
                            error && 'outline-2 outline-red-600',
                            className
                        )}
                        {...props}
                    />
                    {label && <span>{label}</span>}
                </label>
                {error && errorMessage && (
                    <span className="text-red-500 text-xs">* {errorMessage}</span>
                )}
            </div>
        );
    }
);
RadioInput.displayName = 'RadioInput';
