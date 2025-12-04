'use client'
import React, { useState } from 'react'
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { BasicTable, BCol, BRow } from '@/shared/ui/components/tables/BasicTable';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { AiFillProfile } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
interface Props {
    employees: EmployeeEntity[]
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
        <BasicTable theadList={heads} isActions={true}>
            {employees.map(item => (<>
                <BRow>
                    <BCol>{item.employeeId}</BCol>
                    <BCol>{`${item.firstName} ${item.lastName}`}</BCol>
                    <BCol>{item.phoneNumber}</BCol>
                    <BCol>{item.email}</BCol>
                    <BCol><Badge type="green">{item.employeeRole?.name}</Badge></BCol>
                    <BCol>{item.entryTime}</BCol>
                    <BCol>{item.exitTime}</BCol>
                    <BCol className="text-right flex justify-end">
                        <Button onClick={() => handleRouter(item.employeeId)} color='yellow' size='sm' title='Da click para ver el perfil del empleado.'>
                            {employeeId===item.employeeId ? <Spinner size={14} /> : <AiFillProfile size={14} />}<span>Perfil</span>
                        </Button>
                    </BCol>
                </BRow>
            </>))}
        </BasicTable>
    )
}

export { EmployeeDesktopTable };
