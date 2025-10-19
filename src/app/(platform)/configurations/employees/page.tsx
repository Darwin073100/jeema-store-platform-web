import { findAllEmployeesByEstablishmentIdAction } from "@/features/employee/actions/find-all-employees-by-establishment-id.action";
import { Badge } from "@/ui/components/badges/Badge";
import { Button } from "@/ui/components/buttons";
import { TextInput } from "@/ui/components/inputs";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BasicTable, BCol, BRow } from "@/ui/components/tables/BasicTable";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { Metadata } from "next";
import { AiFillProfile } from "react-icons/ai";
import { IoPersonAdd } from "react-icons/io5";

export const metadata: Metadata = {
    title: 'Configurations'
}

export default async function(){
    const heads = ['Folio', 'Empleado', 'Telefono', 'Correo', 'Rol', 'H. Entrada', 'H. Salida']
    const breadCrumbItems: BreadcrumbItem[] = [
        {label: 'Configuraciones', href: '/configurations'},
        {label: 'Empleados'},
    ]
    const userResponse = await findAllEmployeesByEstablishmentIdAction();
    const data = userResponse?.value?.employees ?? [];

    return (
        <ProtectedRoute>
            <TemplateHeader title="Empleados del establecimiento" detail="Lista de los empleados de este establecimeinto." breadcrumbItems={breadCrumbItems}>
                <div className="flex gap-4 items-center justify-between">
                    <Button><IoPersonAdd /> Nuevo empleado</Button>
                    <div>
                        Empleados<Badge>{data.length}</Badge>
                    </div>
                </div>
                <div>
                    <TextInput placeholder="Buscar por nombre de empleado"/>
                </div>
                <BasicTable theadList={heads} isActions={true}>
                    {data.map(user=> (<>
                        <BRow>
                            <BCol>{user.employeeId}</BCol>
                            <BCol>{`${user.firstName} ${user.lastName}`}</BCol>
                            <BCol>{user.phoneNumber}</BCol>
                            <BCol>{user.email}</BCol>
                            <BCol><Badge type="green">{user.employeeRole?.name}</Badge></BCol>
                            <BCol>{user.entryTime}</BCol>
                            <BCol>{user.exitTime}</BCol>
                            <BCol className="text-right flex justify-end">
                                <Button color='yellow' size='sm' title='Da click para ver el perfil del cliente.'>
                                    <AiFillProfile size={14} /><span>Perfil</span>
                                </Button>
                            </BCol>
                        </BRow>
                    </>))}
                </BasicTable>
            </TemplateHeader>
        </ProtectedRoute>
    )
}