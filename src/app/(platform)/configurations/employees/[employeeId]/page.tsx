import { findAllRoleAction } from "@/features/auth/actions/find-all-role.action";
import { findAllEmployeeRolesAction } from "@/contexts/employee-management/employee-role/presentation/actions/find-all-employee-roles.action";
import { findEmployeeByIdAction } from "@/contexts/employee-management/employee/presentation/actions/find-employee-by-id.action";
import { EmployeeLaboralInformation } from "@/contexts/employee-management/employee/presentation/ui/details/EmployeeLaboralInformation";
import { EmployeeProfileCard } from "@/contexts/employee-management/employee/presentation/ui/details/EmployeeProfileCard";
import { EmployeeUserInformation } from "@/contexts/employee-management/employee/presentation/ui/details/EmployeeUserInformation";
import { formatDateWithOutTime } from "@/shared/lib/utils/date-formatter";
import { Button } from "@/shared/ui/components/buttons";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { Metadata } from "next";
import Link from "next/link";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Perfil del empleado'
}

interface Props {
    params: {
        employeeId: string;
    }
}

export default async function SaleInformationPage({ params }: Props) {
    try {
        const { employeeId } = await params;
        const employee = await findEmployeeByIdAction(BigInt(employeeId));
        const data = employee?.value;
        const userRoles = await findAllRoleAction();
        const currentUserRoles = userRoles.value?.roles ?? [];
        const employeeRolesResult = await findAllEmployeeRolesAction();
        const empoyeeRoles = employeeRolesResult.value?.employeeRoles ?? [];

        const breadcrumbItems: BreadcrumbItem[] = [
            {
                label: 'configuraciones',
                href: '/configurations'
            },
            {
                label: 'empleados',
                href: '/configurations/employees'
            },
            {
                label: `${data?.firstName ?? ''} ${data?.lastName ?? ''}`
            }
        ]

        if (!employee?.ok || !data) {
            return (
                <ProtectedRoute>
                    <main className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50 p-4">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-300 text-red-800 px-6 py-8 rounded-xl shadow-lg text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <h2 className="text-xl font-bold mb-2">¡Oops! No pudimos encontrar la informacion del empleado</h2>
                            <p className="text-red-700">El perfil del empleado no existe en nuestra base de datos o no se pudo cargar en este momento.</p>
                            <div className="mt-6">
                                <Link href="/employees">
                                    <Button color="red">
                                        🏠 Volver a la lista de empleados
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </main>
                </ProtectedRoute>
            );
        }
        return (
            <ProtectedRoute>
                <TemplateHeader title={`${data?.firstName ?? ''} ${data?.lastName ?? ''}`} detail="Información del perfil del empleado, como nota adicional, el correo personal del empleado es diferente del correo para acceso al sistema, pero puedes utilizar el mismo." breadcrumbItems={breadcrumbItems}>
                        {/* LAYOUT PRINCIPAL: 1/3 Ficha Personal y 2/3 Datos Laborales/Gestión */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* COLUMNA LATERAL (FICHA DE IDENTIDAD Y CONTACTO) - 1/3 */}
                            <EmployeeProfileCard
                                employeeRoles={empoyeeRoles}
                                data={data}/> 

                            {/* COLUMNA PRINCIPAL (DATOS LABORALES Y GESTIÓN) - 2/3 */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* 2. DATOS LABORALES Y TIEMPO */}
                                <EmployeeLaboralInformation 
                                    data={data}/>

                                {/* 3. GESTIÓN DE USUARIO Y ACCESO */}
                                <EmployeeUserInformation 
                                    userRoles={currentUserRoles}
                                    data={data}/>

                                {/* 4. INFORMACIÓN ADICIONAL (CREATED AT, ETC.) */}
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                                        Trazabilidad
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="font-semibold text-gray-600">Creado en</p>
                                            <p className="text-gray-800">{formatDateWithOutTime(data.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-600">ID de Empleado</p>
                                            <p className="font-mono text-gray-800">#{data.employeeId}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                </TemplateHeader>
            </ProtectedRoute>
        )
    } catch (error) {
        return (
            <ProtectedRoute>
                <main className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50 p-4">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-300 text-red-800 px-6 py-8 rounded-xl shadow-lg text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-xl font-bold mb-2">¡Oops! No pudimos encontrar la informacion del empleado</h2>
                        <p className="text-red-700">El perfil del empleado no existe en nuestra base de datos o no se pudo cargar en este momento.</p>
                        <div className="mt-6">
                            <Link href="/employees">
                                <Button color="red">
                                    🏠 Volver a la lista de empleados
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </ProtectedRoute>
        );
    }
}