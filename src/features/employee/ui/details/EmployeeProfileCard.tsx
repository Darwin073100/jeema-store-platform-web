'use client'
import { Badge } from '@/shared/ui/components/badges/Badge';
import React, { useEffect } from 'react'
import { FcBusinessman, FcBusinesswoman, FcDecision } from 'react-icons/fc';
import { GenderEnum } from '../../domain/enums/gender.enum';
import { formatDateWithOutTime } from '@/shared/lib/utils/date-formatter';
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { Button } from '@/shared/ui/components/buttons';
import { HiPencil } from 'react-icons/hi';
import { EmployeeUpdateModal } from '../register/EmployeeUpdateModal';
import { useEmployeeUIStore } from '../../infraestructure/stores/employee-ui.store';
import { EmployeeRoleEntity } from '../../domain/entities/employee-role.entity';
import { useEmployeeStore } from '../../infraestructure/stores/employee-store';
import { EmployeeAddressCard } from './EmployeeAddressCard';
interface Props {
    data        : EmployeeEntity,
    employeeRoles: EmployeeRoleEntity[],
}
const EmployeeProfileCard = ({ data, employeeRoles }: Props) => {
    const { openEmployeeModal } = useEmployeeUIStore();
    const { setEmployee } = useEmployeeStore()
    useEffect(()=>{
        setEmployee(data);
    },[]);
    return (
        <aside className="lg:col-span-1 space-y-6">

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 text-center">

                {/* Foto de Perfil (similar al diseño de referencia) */}
                <div className="mx-auto w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200 shadow-md flex justify-center items-center">
                    {
                        data.gender === GenderEnum.MALE
                            ? <FcBusinessman size={100} />
                            : data.gender === GenderEnum.FEMALE
                                ? <FcBusinesswoman size={100} />
                                : data.gender === GenderEnum.OTHER || (!data.gender)
                                    ? <FcDecision size={100} /> : <FcDecision size={100} />
                    }
                </div>

                <h2 className="text-2xl font-bold text-gray-900">{data.firstName} {data.lastName}</h2>
                <div className='flex justify-center items-center gap-2 mb-2'>
                    <p className="text-md font-semibold text-green-600">{ data.employeeRole?.name }</p>
                    <Button size='sm' onClick={()=> openEmployeeModal('editEmployee')}><HiPencil/> Editar</Button>
                </div>

                {/* Badge de Estatus */}
                <Badge className="mb-4">{!data.deletedAt? 'Activo': 'Inactivo'}</Badge>

                {/* Ficha de Detalles */}
                <dl className="text-sm text-left pt-2 space-y-3">
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Email:</span>
                        <span className="text-blue-600 hover:underline break-all">{data.email}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Teléfono:</span>
                        <span className="text-gray-800">{data.phoneNumber}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Cumpleaños:</span>
                        <span className="text-gray-800">{formatDateWithOutTime(data.birthDate)}</span>
                    </div>
                    <div className="py-1 bg-gray-100 flex justify-between p-2 rounded-lg">
                        <span className="font-semibold text-gray-600">Género:</span>
                        <span className="text-gray-800 capitalize">{data.gender}</span>
                    </div>
                </dl>
            </div>
            <EmployeeAddressCard />
            <EmployeeUpdateModal
                employeeRoles={employeeRoles} 
                employee={data}/>
        </aside>
    )
}

export {EmployeeProfileCard};
