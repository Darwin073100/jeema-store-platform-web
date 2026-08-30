import { findAllSuplierByEstablishmentId } from "@/contexts/purchase-management/suplier/presentation/actions/find-all-suplier-by-establishment.action";
import { SuplierActionsBar } from "@/contexts/purchase-management/suplier/presentation/ui/SuplierActionsBar";
import { SuplierCardList } from "@/contexts/purchase-management/suplier/presentation/ui/SuplierCardList";
import { SuplierDesktopTable } from "@/contexts/purchase-management/suplier/presentation/ui/SuplierDesktopTable";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader"

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

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
                    <div className="hidden md:block overflow-x-auto">
                        <SuplierDesktopTable />
                    </div>
                    <div className="md:hidden flex flex-col gap-3 w-full">
                        <SuplierCardList />
                    </div>
                </main>
            </TemplateHeader>
        </ProtectedRoute>
    )
}