'use client'
import clsx from "clsx"
import React, { useState } from "react"
import { IconType } from "react-icons"
import { AiOutlineQuestionCircle } from "react-icons/ai"

interface Props {
    Icon?: IconType
    value: string,
    error?: boolean,
    errorMessage?: string
    htmlFor?: string,
    className?: string,
    required?: 'yes'|'no',
    description?: string,
}

export const LabelInput = ({ required, value, Icon, error = false, errorMessage, htmlFor, className, description }: Props) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div>
            <label htmlFor={htmlFor} className={clsx(`flex gap-1 items-center font-medium text-gray-700`, className)}>
                {!!Icon && <Icon />}
                <span>{value}</span>
                {error && <span className="text-red-600 text-[10px]">* {errorMessage}</span>}
                {
                    required=='yes' ? <span className="text-red-600 text-[15px]">*</span> : null
                }
                {
                    required=='no' ? <span className="text-green-600 text-[13px]">(Opcional)</span> : null
                }
                {description && (
                    <div className="relative inline-block">
                        <AiOutlineQuestionCircle
                            className="text-gray-500 hover:text-blue-500 cursor-help ml-1 w-4 h-4"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        />
                        {showTooltip && (
                            <div className="absolute z-60 w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -right-24 top-6">
                                <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -top-1 right-25"></div>
                                {description}
                            </div>
                        )}
                    </div>
                )}
            </label>
        </div>
    )
}
