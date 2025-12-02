'use client'
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { TextInput } from '@/ui/components/inputs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaFilter } from 'react-icons/fa';
import { TransactionEntity } from '../domain/entities/transaction.entity';
interface Props {
    transactions: TransactionEntity[]
}
const TransactionMovementsOptios = ({ transactions }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const handleNewEmployee = () => {
        setLoading(true);
        router.push('/customers/new');
    }

    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <span></span>
                <div className='flex gap-4 items-center'>
                    <Button disabled={loading} color='green'>
                        <PiMicrosoftExcelLogoFill />
                        Exportar a Excel
                    </Button>
                    <div>
                        Movimientos<Badge>{transactions.length}</Badge>
                    </div>
                </div>
            </div>
            <div className='flex gap-4'>
                <div>
                    Fecha de inicio
                    <TextInput
                    type='date' />
                </div>
                <div>
                    Fecha de límite
                    <TextInput
                    type='date' />
                </div>
                <div className='flex items-end'>
                    <Button disabled={loading} color='yellow'>
                        <FaFilter />
                        Aplicar filtro
                    </Button>
                </div>
            </div>
        </>
    )
}

export { TransactionMovementsOptios };
