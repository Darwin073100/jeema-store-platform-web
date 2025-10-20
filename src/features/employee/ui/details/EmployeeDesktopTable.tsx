import React from 'react'
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { BasicTable, BCol, BRow } from '@/ui/components/tables/BasicTable';
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { AiFillProfile } from 'react-icons/ai';
interface Props {
    employees: EmployeeEntity[]
}
const EmployeeDesktopTable = ({ employees }: Props) => {
    const heads = ['Folio', 'Empleado', 'Telefono', 'Correo', 'Rol', 'H. Entrada', 'H. Salida']
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
                        <Button color='yellow' size='sm' title='Da click para ver el perfil del cliente.'>
                            <AiFillProfile size={14} /><span>Perfil</span>
                        </Button>
                    </BCol>
                </BRow>
            </>))}
        </BasicTable>
    )
}

export { EmployeeDesktopTable };
