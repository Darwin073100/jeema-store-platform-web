'use client'
import React, { useState } from 'react'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { BasicTable, BCol, BRow } from '@/shared/ui/components/tables/BasicTable';
import { AiFillProfile } from 'react-icons/ai';
import { UserEntity } from '../domain/entities/user.entity';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
interface Props {
    data: UserEntity[]
}
const UserTableDesktop = ({ data }: Props) => {
    const [employeeId, setEmployeeId] = useState(BigInt(0));
    const router = useRouter();

    const handleRoute = (id: bigint)=> {
        setEmployeeId(id);
        router.push(`/configurations/employees/${id}`);
    }

    const heads = ['Folio', 'Empleado', 'Nom. de Usuario', 'Correo', 'Estado']
    return (
        <BasicTable theadList={heads} isActions={true}>
            {data.map(user => (<>
                <BRow>
                    <BCol>{user.userId}</BCol>
                    <BCol>{`${user.employee?.firstName} ${user.employee?.lastName}`}</BCol>
                    <BCol>{user.username}</BCol>
                    <BCol>{user.email}</BCol>
                    <BCol>
                        <Badge type={user.isActive ? 'green' : 'red'}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                    </BCol>
                    <BCol className="text-right flex justify-end">
                        <Button onClick={()=> handleRoute(user.employeeId)} color='yellow' size='sm' title='Da click para ver el perfil del cliente.'>
                            {employeeId===user.employeeId? <Spinner size={14}/> :<AiFillProfile size={14} />}<span>Detalles</span>
                        </Button>
                    </BCol>
                </BRow>
            </>))}
        </BasicTable>
    )
}

export { UserTableDesktop };
