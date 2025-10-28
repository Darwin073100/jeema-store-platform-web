import React from 'react'
import { FcKey } from 'react-icons/fc';
import { EmployeeEntity } from '../../domain/entities/employee.entity';
interface Props {
    data: EmployeeEntity
}
const EmployeeUserInformation = ({ data }:Props) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                <FcKey /> <span>Gestión de Usuario y Acceso</span>
            </h2>

            {data.user ? (
                // Opción 1: EL EMPLEADO YA TIENE USUARIO ASIGNADO
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md">
                    <p className="font-bold text-blue-800 mb-1">Email de Acceso Asignado</p>
                    <div className="flex justify-between items-center text-sm">
                        <div>
                            <span className="font-semibold text-gray-700">Email:</span> <span className="font-mono text-gray-900">{data.user.email}</span>
                        </div>
                        <div>
                            <button className="text-orange-500 hover:text-orange-700 font-semibold transition-colors mr-3">
                                Restablecer Contraseña
                            </button>
                            <button className="text-red-500 hover:text-red-700 font-semibold transition-colors">
                                Eliminar Usuario
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Opción 2: DAR DE ALTA USUARIO (SOLUCIÓN AL REQUERIMIENTO)
                <div className="p-5 bg-orange-50 border-l-4 border-orange-400 rounded-md flex justify-between items-center">
                    <p className="font-bold text-orange-800">
                        ⚠️ No hay usuario de acceso asignado.
                    </p>
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                        Dar de Alta Usuario
                    </button>
                </div>
            )}
        </div>
    )
}

export { EmployeeUserInformation };
