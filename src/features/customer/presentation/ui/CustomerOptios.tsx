'use client'
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { TextInput } from '@/ui/components/inputs';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
import React from 'react'
import { IoPersonAdd } from 'react-icons/io5';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
interface Props {
    customersNo: number
}
const CustomerOptios = ({ customersNo }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const handleNewEmployee = () => {
        setLoading(true);
        router.push('/customers/new');
    }
    return (
        <>
            <div className="flex gap-4 items-center justify-between">
                <Button onClick={() => handleNewEmployee()} disabled={loading}>
                    {loading ? <Spinner /> : <IoPersonAdd />}
                    Cliente nuevo
                </Button>
                <div className='flex gap-4 items-center'>
                    <Button disabled={loading} color='green'>
                        <PiMicrosoftExcelLogoFill />
                        Exportar a Excel
                    </Button>
                    <div>
                        Empleados<Badge>{customersNo}</Badge>
                    </div>
                </div>
            </div>
            <div>
                <TextInput placeholder="Buscar por nombre del cliente"/>
            </div>
        </>
    )
}

export { CustomerOptios };
