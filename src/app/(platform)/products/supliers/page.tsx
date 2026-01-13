import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader"

const breadcrumbItems: BreadcrumbItem[] = [
    {label: 'Productos', href: '/products'},
    {label: 'Proveedores'},
]
export default function(){
    return(
        <ProtectedRoute>
            <TemplateHeader title="Catalogo de proveedores" detail="Lista proveedores" breadcrumbItems={breadcrumbItems}>
                <main className="flex flex-col gap-4 w-full">

                </main>
            </TemplateHeader>
        </ProtectedRoute>
    )
}