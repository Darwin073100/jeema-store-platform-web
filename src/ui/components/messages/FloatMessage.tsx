'use client'
import clsx from "clsx"
import { useEffect, useState } from "react"
import { IoClose } from "react-icons/io5"
import { FcCheckmark, FcHighPriority, FcIdea, FcOk } from "react-icons/fc";

interface Props {
    summary?: string,
    description?: string | string[],
    type?: 'blue' | 'green' | 'yellow' | 'red',
    isActive?: boolean,
}

export const FloatMessage = ({ summary = 'Massage', description = 'Message Description', type = 'blue', isActive = false }: Props) => {
    const [isVisible, setIsVisible] = useState<boolean>(isActive);

    const getIcon = () => {
        switch(type) {
            case 'blue':
                return <FcOk className="text-2xl" />
            case 'green':
                return <FcCheckmark className="text-2xl" />;
            case 'yellow':
                return <FcIdea  className="text-2xl" />;
            case 'red':
                return <FcHighPriority className="text-2xl" />;
            default:
                return <FcCheckmark className="text-2xl" />;
        }
    };

    useEffect(() => {
        setIsVisible(isActive);
    }, [isActive]);

    return (
        <>
            {isVisible && (
                <div 
                    className={clsx(
                        "fixed right-4 top-4 p-4 rounded-lg shadow-lg transition-all z-[9999] flex items-center gap-4 border-4 border-white",
                        {
                            'bg-blue-500 text-white': type === 'blue',
                            'bg-green-500 text-white': type === 'green',
                            'bg-yellow-500 text-white': type === 'yellow',
                            'bg-red-500 text-white': type === 'red'
                        }
                    )}
                >
                    <div className="flex-shrink-0 bg-white w-[36px] h-[36px] rounded-full flex items-center justify-center">
                        {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-4 mb-1">
                            <span className="font-semibold">{summary}</span>
                            <button 
                                className={clsx(
                                    "p-1 rounded-full transition-colors",
                                    {
                                        'hover:bg-blue-400': type === 'blue',
                                        'hover:bg-green-400': type === 'green',
                                        'hover:bg-yellow-400': type === 'yellow',
                                        'hover:bg-red-400': type === 'red'
                                    }
                                )} 
                                onClick={() => setIsVisible(false)}
                            >
                                <IoClose className="text-xl" />
                            </button>
                        </div>
                        <div>
                            <span>{description}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
