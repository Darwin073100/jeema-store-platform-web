import { ConfigInformationCloud } from "@/contexts/transaction-management/transaction/presentation/ui/cloud/ConfigInformationCloud";
import { RegisterBranchAndEstablishment } from "@/contexts/transaction-management/transaction/presentation/ui/cloud/RegisterBranchAndEstablishment";
import { RegisterCloudBranch } from "@/contexts/transaction-management/transaction/presentation/ui/cloud/RegisterCloudBranch";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { Button } from "@/shared/ui/components/buttons";
import { ButtonOutLine } from "@/shared/ui/components/buttons/ButtonOutLine";
import { TextInput } from "@/shared/ui/components/inputs";
import { LabelInput } from "@/shared/ui/components/labels";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { BiCloud, BiLink } from "react-icons/bi";
import { BsCloud, BsCloudCheck, BsCloudSlash, BsShop } from "react-icons/bs";
import { IoReload, IoSave } from "react-icons/io5";

export default async function () {

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Traspasos', href: '/transfers' },
        { label: 'Configurar sucursal' }
    ]
    return (
        <ProtectedRoute requiredRoles={['global_admin', 'establishment_manager', 'branch_office_management']}>
            <TemplateHeader title="Configurar sucursal" detail="Realiza la configuración para que tu sucursal envíe y reciba traspasos de otras sucursale." breadcrumbItems={breadcrumbItems}>
                <ConfigInformationCloud/>
                <article className="flex gap-4 text-gray-600 mt-4">
                    <RegisterBranchAndEstablishment />
                    <RegisterCloudBranch />
                </article>
            </TemplateHeader>
        </ProtectedRoute>
    );
}