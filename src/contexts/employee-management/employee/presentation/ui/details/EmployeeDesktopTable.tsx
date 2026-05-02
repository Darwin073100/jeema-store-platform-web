'use client'
import React, { useState } from 'react'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { AiFillProfile } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { PCol, PrimaryTable, PRow } from '@/shared/ui/components/tables/PrimaryTable';
import { IEmployee } from '../../interfaces/IEmployee';
interface Props {
    employees: IEmployee[]
}
const EmployeeDesktopTable = ({ employees }: Props) => {
    const heads = ['Folio', 'Empleado', 'Telefono', 'Correo', 'Rol', 'H. Entrada', 'H. Salida']
    const [employeeId, setEmployeeId] = useState(BigInt(0));
    const router = useRouter();
    const handleRouter = (id: bigint) => {
        setEmployeeId(id);
        router.push(`/configurations/employees/${id.toString()}`);
    }
    return (
        <PrimaryTable theadList={heads} isActions={true}>
            {employees.map(item => (<>
                <PRow>
                    <PCol>{item.employeeId}</PCol>
                    <PCol>{`${item.firstName} ${item.lastName}`}</PCol>
                    <PCol>{item.phoneNumber}</PCol>
                    <PCol>{item.email}</PCol>
                    <PCol><Badge type="green">{item.employeeRole?.name}</Badge></PCol>
                    <PCol>{item.entryTime}</PCol>
                    <PCol>{item.exitTime}</PCol>
                    <PCol className="text-right flex justify-end">
                        <Button onClick={() => handleRouter(item.employeeId)} size='sm' title='Da click para ver el perfil del empleado.'>
                            {employeeId===item.employeeId ? <Spinner size={14} /> : <AiFillProfile size={14} />}<span>Perfil</span>
                        </Button>
                    </PCol>
                </PRow>
            </>))}
        </PrimaryTable>
    )
}

export { EmployeeDesktopTable };
