'use client'
import React, { useState } from 'react'
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { BasicTable, BCol, BRow } from '@/ui/components/tables/BasicTable';
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { AiFillProfile } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/ui/components/loadings/Spinner';
interface Props {
    employees: EmployeeEntity[]
}
const EmployeeDesktopTable = ({ employees }: Props) => {
    const heads = ['Folio', 'Empleado', 'Telefono', 'Correo', 'Rol', 'H. Entrada', 'H. Salida']
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleRouter = (route: string)=>{
        setLoading(true);
        router.push(route);
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
                        <Button onClick={()=> handleRouter(`/configurations/employees/${item.employeeId.toString()}`)} color='yellow' size='sm' title='Da click para ver el perfil del empleado.'>
                            {loading? <Spinner />: <AiFillProfile size={14} />}<span>Perfil</span>
                        </Button>
                    </BCol>
                </BRow>
            </>))}
        </BasicTable>
    )
}

export { EmployeeDesktopTable };
