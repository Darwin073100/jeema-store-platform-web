'use client'
import { CashSessionEntity } from '@/features/cash/domain/entities/cash-session.entity';
import { useCashStore } from '@/features/cash/infraestructure/stores/cash.store';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { Badge } from '@/ui/components/badges/Badge';
import clsx from 'clsx';
import React, { useEffect } from 'react'
import { FcBearish, FcBullish, FcComboChart, FcDebt } from 'react-icons/fc';
import { useCashInformation } from '../../hooks/useCashInformation';

interface Props {
    cashSession: CashSessionEntity
}

const CashInfo = ({ cashSession }: Props) => {
    const { setCashSessionSelected } = useCashStore();
    const { handleTotalIn, handleTotalOut, handleTotalClose } = useCashInformation();
    useEffect(()=>{
        setCashSessionSelected(cashSession)
    },[cashSession]);
  return (
    <section className="flex flex-col gap-4">
        <div className="bg-blue-100 p-4 rounded-2xl flex gap-4 items-center text-lg shadow-lg">
            <FcComboChart /> <span>Corte</span>
        </div>
        <div className={clsx(`p-4 rounded-2xl bg-blue-100 shadow-lg flex justify-between`)}>
            <div className="flex flex-col justify-center items-center">
                <Badge type='green'>Ingresos</Badge>
                <FcBullish size={30}/>
            </div>
            <div className="flex justify-between gap-2 text-green-700 items-center font-bold text-lg">
                <span>Total:</span>
                <span>{numberMoneyFormat(handleTotalIn())}</span>
            </div>
        </div>
        <div className={clsx(`p-4 rounded-2xl bg-blue-100 shadow-lg flex justify-between`)}>
            <div className="flex flex-col justify-center items-center">
                <Badge type='red'>Egresos</Badge>
                <FcBearish size={30}/>
            </div>
            <div className="flex justify-between gap-2 text-red-700 items-center font-bold text-lg">
                <span>Total:</span>
                <span>{`- ${numberMoneyFormat(handleTotalOut())}`}</span>
            </div>
        </div>
        <div className={clsx(`p-4 rounded-2xl bg-blue-100 shadow-lg flex justify-between`)}>
            <div className="flex flex-col justify-center items-center">
                <Badge type='blue'>Corte</Badge>
                <FcDebt size={30}/>
            </div>
            <div className="flex justify-between gap-2 text-blue-700 items-center font-bold text-2xl">
                <span>Total del corte:</span>
                <span>{numberMoneyFormat(handleTotalClose())}</span>
            </div>
        </div>
    </section>
  )
}

export { CashInfo };
