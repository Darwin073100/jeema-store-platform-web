import { findAllByEstablishmentIdAction } from "@/contexts/authentication-management/auth/presentation/actions/find-all-by-establishment-id.action";
import { UserTableDesktop } from "@/contexts/authentication-management/auth/presentation/ui/UserTableDesktop";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { Button } from "@/shared/ui/components/buttons";
import { TextInput } from "@/shared/ui/components/inputs";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { Metadata } from "next";
import { IoPersonAdd } from "react-icons/io5";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

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
        <ProtectedRoute requiredRoles={['global_admin','establishment_manager', 'branch_office_management']}>
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