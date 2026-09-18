import React from 'react'
import { Badge } from '../../badges/Badge'
import clsx from 'clsx'
import { IconType } from 'react-icons';
import { IoMdHeartEmpty } from 'react-icons/io';

interface ReportCardPorps {
    type?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'
    title: string;
    description: string | React.ReactNode;
    Icon?: IconType;
    //TODO: Pendiente implementar soporte para elegir entre Imagen o Icono. 
    picture?: string;
    isAdd?: boolean;
    addText?: string;
    tooltip?: string;
}

export const ReportCard = ({ title, description, Icon, picture, isAdd, addText, tooltip, type='blue' }: ReportCardPorps) => {
    return (
        <div
            className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex flex-col gap-3`)}
            title={tooltip}>
            <Badge type={type}>{title}</Badge>
            <div className="flex justify-between items-center gap-2">
                {Icon ? <Icon size={30} /> : <IoMdHeartEmpty size={30} />}

                <div className={clsx(`flex justify-between gap-2 text-${type}-700 items-center font-bold text-lg`)}>
                    <span>{description}</span>
                </div>
            </div>
            {isAdd && (
                <span className="text-xs text-gray-500 text-right">
                    {addText ? addText : 'N/A'}
                </span>
            )}
        </div>
    )
}
