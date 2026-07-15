import { userWorkspaceAction } from "@/contexts/authentication-management/auth/presentation/actions/user-workspace.action";
import { ConfigInformationCloud } from "@/contexts/inventory-management/transfer/presentation/ui/cloud/ConfigInformationCloud";
import { RegisterBranchAndEstablishment } from "@/contexts/inventory-management/transfer/presentation/ui/cloud/RegisterBranchAndEstablishment";
import { RegisterCloudBranch } from "@/contexts/inventory-management/transfer/presentation/ui/cloud/RegisterCloudBranch";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";


export default async function () {
    const workspace = await userWorkspaceAction();
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Traspasos', href: '/transfers' },
        { label: 'Configurar sucursal' }
    ]
    return (
        <ProtectedRoute requiredRoles={['global_admin', 'establishment_manager', 'branch_office_management']}>
            <TemplateHeader title="Configurar sucursal" detail="Realiza la configuración para que tu sucursal envíe y reciba traspasos de otras sucursale." breadcrumbItems={breadcrumbItems}>
                <ConfigInformationCloud workspace={workspace.value ?? null}/>
                <article className="flex gap-4 text-gray-600 mt-4">
                    <RegisterBranchAndEstablishment workspace={workspace.value ?? null}/>
                    <RegisterCloudBranch workspace={workspace.value ?? null}/>
                </article>
            </TemplateHeader>
        </ProtectedRoute>
    );
}