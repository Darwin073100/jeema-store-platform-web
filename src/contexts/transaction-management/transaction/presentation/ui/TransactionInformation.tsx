'use client'
import { numberMoneyFormat } from "@/shared/lib/utils/number-formatter"
import { Badge } from "@/shared/ui/components/badges/Badge"
import clsx from "clsx"
import { FcBearish, FcBullish, FcDebt, FcLibrary } from "react-icons/fc"
import React from "react"
import { useTransactionInformation } from "../hooks/useTransactionInformation"

export const TransactionInformation = ()=> {
    const { incomes, expenses } = useTransactionInformation();
    return (
        <section className="w-full flex gap-4 my-4">
        <div className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex justify-between`)}>
            <div className="flex flex-col justify-center items-center">
                <Badge type='green'>Ingresos</Badge>
                <FcBullish size={30}/>
            </div>
            <div className="flex justify-between gap-2 text-green-700 items-center font-bold text-lg">
                <span>Total:</span>
                <span>{numberMoneyFormat(incomes())}</span>
            </div>
        </div>
        <div className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex justify-between`)}>
            <div className="flex flex-col justify-center items-center">
                <Badge type='red'>Egresos</Badge>
                <FcBearish size={30}/>
            </div>
            <div className="flex justify-between gap-2 text-red-700 items-center font-bold text-lg">
                <span>Total:</span>
                <span>{`- ${numberMoneyFormat(expenses())}`}</span>
            </div>
        </div>
        <div className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex justify-between`)}>
            <div className="flex flex-col justify-center items-center">
                <Badge type='blue'>Corte</Badge>
                <FcDebt size={30}/>
            </div>
            <div className="flex justify-between gap-2 text-blue-700 items-center font-bold text-2xl">
                <span>Total:</span>
                <span>{numberMoneyFormat((incomes() - expenses()))}</span>
            </div>
        </div>
    </section>
    )
}