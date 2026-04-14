import React from 'react'
interface Props {
    title: string,
    icon?: any,
    children?: any
}
const CardGrid = ({ icon, title, children }: Props) => {
    return (
        <div className="bg-white p-4 rounded-2xl">
            <div className="flex gap-2 items-center font-bold">
                {icon}
                <span>{title}</span>
            </div>
            <div>{children}</div>
        </div>
    )
}
export { CardGrid };
