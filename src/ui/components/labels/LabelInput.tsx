import clsx from "clsx"
import React from "react"
import { IconType } from "react-icons"

interface Props {
    Icon?: IconType
    value: string,
    error?: boolean,
    errorMessage?: string
    htmlFor?: string,
    className?: string,
    required?: 'yes'|'no',
}

export const LabelInput = ({ required, value, Icon, error = false, errorMessage, htmlFor, className }: Props) => {
    return (
        <div>
            <label htmlFor={htmlFor} className={clsx(`flex gap-1 items-center font-medium text-gray-700 ${className}`)}>
                {!!Icon && <Icon />}
                <span>{value}</span>
                {error && <span className="text-red-600 text-[10px]">* {errorMessage}</span>}
                {
                    required=='yes'?<span className="text-red-600 text-[15px]">*</span> : null
                }
                {
                    required=='no' ?<span className="text-green-600 text-[13px]">(Opcional)</span> : null
                }
            </label>
        </div>
    )
}
