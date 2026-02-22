import { findAllSuplierByEstablishmentId } from "@/features/suplier/actions/find-all-suplier-by-establishment.action";
import { SuplierActionsBar } from "@/features/suplier/presentation/ui/SuplierActionsBar";
import { SuplierDesktopTable } from "@/features/suplier/presentation/ui/SuplierDesktopTable";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader"

const breadcrumbItems: BreadcrumbItem[] = [
    {label: 'Compras', href: '/purchases'},
    {label: 'Proveedores'},
]
export default async function(){
    const data = await findAllSuplierByEstablishmentId(true);
    const supliers = data?.ok && data.value?.supliers ? data.value.supliers : [];
    return(
        <ProtectedRoute>
            <TemplateHeader title="Catalogo de proveedores" detail="Lista proveedores" breadcrumbItems={breadcrumbItems}>
                <main className="flex flex-col gap-4 w-full">
                    <SuplierActionsBar 
                        data={ supliers }/>
                    <SuplierDesktopTable />
                </main>
            </TemplateHeader>
        </ProtectedRoute>
    )
}