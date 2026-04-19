'use client'
import React from 'react'
import CashRegisterItem from './CashRegisterItem';
import { ICashRegister } from '@/contexts/cash-management/cash-register/presentation/interfaces/ICashRegister';
import { useCashRegisterList } from '../hooks/useCashRegisterList';
interface Props {
    cashRegisters: ICashRegister[]
}
const CashRegisterList = ({ cashRegisters }: Props) => {
    const { currentCashRegisters } = useCashRegisterList({cashRegisters});
    return (
        <div className="grid grid-cols-4 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 justify-items-center gap-4">
            {currentCashRegisters().map(item => <>
                <CashRegisterItem
                    key={item.cashRegisterId}
                    cashRegister={item} />
            </>)}
        </div>
    )
}

export { CashRegisterList };
