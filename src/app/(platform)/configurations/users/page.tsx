import { findAllByEstablishmentIdAction } from "@/features/auth/actions/find-all-by-establishment-id.action";
import { UserTableDesktop } from "@/features/auth/ui/UserTableDesktop";
import { Badge } from "@/ui/components/badges/Badge";
import { Button } from "@/ui/components/buttons";
import { TextInput } from "@/ui/components/inputs";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { Metadata } from "next";
import { IoPersonAdd } from "react-icons/io5";

export const metadata: Metadata = {
    title: 'Configurations'
}

export default async function(){
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
                <UserTableDesktop
                    data={data}/>
            </TemplateHeader>
        </ProtectedRoute>
    )
}