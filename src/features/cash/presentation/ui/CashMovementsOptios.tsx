'use client'
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { TextInput } from '@/ui/components/inputs';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { IoPersonAdd } from 'react-icons/io5';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { CashSessionEntity } from '../../domain/entities/cash-session.entity';
import { FaFilter } from 'react-icons/fa';
interface Props {
    cashSessions: CashSessionEntity[]
}
const CashMovementsOptios = ({ cashSessions }: Props) => {
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
                        Movimientos<Badge>{cashSessions.length}</Badge>
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

export { CashMovementsOptios };
