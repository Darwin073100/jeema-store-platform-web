'use client'
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
import React from 'react'
import { IoPersonAdd } from 'react-icons/io5';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
interface Props {
    employeesNo: number
}
const EmployeeOptios = ({ employeesNo }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const handleNewEmployee = () => {
        setLoading(true);
        router.push('/configurations/employees/new');
    }
    return (
        <div className="flex gap-4 items-center justify-between">
            <Button onClick={() => handleNewEmployee()} disabled={loading}>
                {loading ? <Spinner /> : <IoPersonAdd />}
                Nuevo empleado
            </Button>
            <div className='flex gap-4 items-center'>
                <Button disabled={loading} color='green'>
                    <PiMicrosoftExcelLogoFill />
                    Exportar a Excel
                </Button>
                <div>
                    Empleados<Badge>{employeesNo}</Badge>
                </div>
            </div>
        </div>
    )
}

export { EmployeeOptios };
