'use client'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';
import { TextInput } from '@/shared/ui/components/inputs';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
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
        <>
            <div className="flex gap-4 items-center justify-between">
                <ButtonOutLine onClick={() => handleNewEmployee()} disabled={loading}>
                    {loading ? <Spinner /> : <IoPersonAdd />}
                    Nuevo empleado
                </ButtonOutLine>
                <div className='flex gap-4 items-center'>
                    <ButtonOutLine disabled={loading} color='green'>
                        <PiMicrosoftExcelLogoFill />
                        Exportar a Excel
                    </ButtonOutLine>
                    <div>
                        Empleados<Badge>{employeesNo}</Badge>
                    </div>
                </div>
            </div>
            <div>
                <TextInput placeholder="Buscar por nombre de empleado"/>
            </div>
        </>
    )
}

export { EmployeeOptios };
