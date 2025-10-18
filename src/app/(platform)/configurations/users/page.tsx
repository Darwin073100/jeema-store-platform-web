import { findAllByEstablishmentIdAction } from "@/features/auth/actions/find-all-by-establishment-id.action";
import { Badge } from "@/ui/components/badges/Badge";
import { Button } from "@/ui/components/buttons";
import { ButtonOutLine } from "@/ui/components/buttons/ButtonOutLine";
import { TextInput } from "@/ui/components/inputs";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BasicTable, BCol, BRow } from "@/ui/components/tables/BasicTable";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { Metadata } from "next";
import { IoPersonAdd } from "react-icons/io5";

export const metadata: Metadata = {
    title: 'Configurations'
}

export default async function(){
    const heads = ['Folio', 'Empleado', 'Nom. de Usuario', 'Correo']
    const breadCrumbItems: BreadcrumbItem[] = [
        {label: 'Configuraciones', href: '/configurations'},
        {label: 'Usuarios'},
    ]
    const userResponse = await findAllByEstablishmentIdAction();
    const data = userResponse?.value?.users ?? [];

    return (
        <ProtectedRoute>
            <TemplateHeader title="Usuarios del sistema" detail="Lista de los usuarios de este establecimeinto." breadcrumbItems={breadCrumbItems}>
                <div className="flex gap-4 items-center justify-between">
                    <Button><IoPersonAdd /> Nuevo usuario</Button>
                    <div>
                        Usuarios<Badge>{data.length}</Badge>
                    </div>
                </div>
                <div>
                    <TextInput placeholder="Buscar por nombre de empleado"/>
                </div>
                <BasicTable theadList={heads} isActions={true}>
                    {data.map(user=> (<>
                        <BRow>
                            <BCol>{user.userId}</BCol>
                            <BCol>{`${user.employee?.firstName} ${user.employee?.lastName}`}</BCol>
                            <BCol>{user.username}</BCol>
                            <BCol>{user.email}</BCol>
                            <BCol></BCol>
                        </BRow>
                    </>))}
                </BasicTable>
            </TemplateHeader>
        </ProtectedRoute>
    )
}