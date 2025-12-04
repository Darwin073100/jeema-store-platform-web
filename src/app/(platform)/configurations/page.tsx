import { ConfigurationOptions } from "@/features/configurations/presentation/ui/ConfigurationOptions";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { Metadata } from "next";
import { FcSettings } from "react-icons/fc";

export const metadata: Metadata = {
    title: 'Configurations'
}

export default function(){
    const breadCrumbItems: BreadcrumbItem[] = [
        {label: 'Configuraciones'}
    ]
    return (
        <ProtectedRoute>
            <TemplateHeader title="Configuraciones" detail="Pantalla de configuraciones generales del sistema" breadcrumbItems={breadCrumbItems}>
                    <ConfigurationOptions/>
            </TemplateHeader>
        </ProtectedRoute>
    )
}