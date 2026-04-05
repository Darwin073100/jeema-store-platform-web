'use client'
import React, { useState } from 'react'
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { AiFillProfile } from 'react-icons/ai';
import { UserEntity } from '../../../../../features/auth/domain/entities/user.entity';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
import { PCol, PrimaryTable, PRow } from '@/shared/ui/components/tables/PrimaryTable';
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
        <PrimaryTable theadList={heads} isActions={true}>
            {data.map(user => (<>
                <PRow>
                    <PCol>{user.userId}</PCol>
                    <PCol>{`${user.employee?.firstName} ${user.employee?.lastName}`}</PCol>
                    <PCol>{user.username}</PCol>
                    <PCol>{user.email}</PCol>
                    <PCol>
                        <Badge type={user.isActive ? 'green' : 'red'}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                    </PCol>
                    <PCol className="text-right flex justify-end">
                        <Button onClick={()=> handleRoute(user.employeeId)} color='yellow' size='sm' title='Da click para ver el perfil del cliente.'>
                            {employeeId===user.employeeId? <Spinner size={14}/> :<AiFillProfile size={14} />}<span>Detalles</span>
                        </Button>
                    </PCol>
                </PRow>
            </>))}
        </PrimaryTable>
    )
}

export { UserTableDesktop };
