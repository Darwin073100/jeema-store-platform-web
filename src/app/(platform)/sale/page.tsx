import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";

export const metadata = {
    title: 'Ventas'
}
export default function(){
    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: 'ventas'
        }
    ]
    return (
        <ProtectedRoute>
            <TemplateHeader title="Ventas" detail="Vista general de ventas" breadcrumbItems={breadcrumbItems}>
                <h1>Ventas</h1>
            </TemplateHeader>
        </ProtectedRoute>
    );
}