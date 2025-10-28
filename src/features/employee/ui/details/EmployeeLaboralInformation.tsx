import React from 'react'
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { FcBriefcase } from 'react-icons/fc';
import { formatDateWithOutTime, formatTime } from '@/shared/lib/utils/date-formatter';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
interface Props {
    data: EmployeeEntity
}
const EmployeeLaboralInformation = ({ data }: Props) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                <FcBriefcase /> <span>Información Laboral</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

                {/* Fecha de Contratación */}
                <div>
                    <p className="font-semibold text-gray-600">Contratación</p>
                    <p className="text-lg font-bold text-gray-900">{formatDateWithOutTime(data.hireDate)}</p>
                    <p className="text-xs text-blue-600 font-medium">Rol: {data.employeeRole?.name}</p>
                </div>

                {/* Horario */}
                <div>
                    <p className="font-semibold text-gray-600">Horario Laboral</p>
                    <p className="text-lg font-bold text-gray-900">
                        {formatTime(data.entryTime)} - {formatTime(data.exitTime)}
                    </p>
                    <p className="text-xs text-gray-500">Jornada de {parseInt(data?.exitTime ?? '0') - parseInt(data?.entryTime ?? '0')} horas</p>
                </div>

                {/* Salario Actual */}
                <div>
                    <p className="font-semibold text-gray-600">Salario por día</p>
                    <p className="text-2xl font-extrabold text-emerald-600">
                        {numberMoneyFormat(data.currentSalary ?? 0)}
                    </p>
                    <button className="text-xs text-blue-500 hover:text-blue-700 mt-1">Ver Historial</button>
                </div>
            </div>
        </div>
    )
}

export { EmployeeLaboralInformation };
