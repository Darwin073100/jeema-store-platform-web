'use client'
import clsx from "clsx"
import { useEffect, useState } from "react"
import { IoClose } from "react-icons/io5"

interface Props {
    summary?: string,
    description?: string|string[],
    type?: 'blue' | 'green' | 'yellow' | 'red',
    isActive?: boolean,
}

export const FloatMessage = ({ summary = 'Massage', description = 'Message Description', type = 'blue', isActive = false }: Props) => {

    const [isVisible, setIsVisible] = useState<boolean>(isActive);

    useEffect(()=>{
        setIsVisible(isActive);
    },[isActive]);

    return (
        <>
            {isVisible && (
                <div className={clsx(`fixed right-4 top-4 bg-${type}-500 text-white p-3 rounded-md transition-all z-[9999]`)}>
                    <div className="flex justify-between items-center gap-8 font-bold">
                        <span>{summary}</span>
                        <button className={clsx(`cursor-pointer rounded-full hover:bg-${type}-200`)} onClick={() => setIsVisible(false)}>
                            <IoClose className="text-[20px]" />
                        </button>
                    </div>
                    <div>
                        <span>{description}</span>
                    </div>
                </div>
            )}
        </>
    )
}
