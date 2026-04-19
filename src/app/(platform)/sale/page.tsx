import { findAllSaleByBranchOfficeAction } from "@/contexts/sale-management/sale/presentation/actions/find-all-sale-by-branch-office.action";
import { SaleActionsBar } from "@/contexts/sale-management/sale/presentation/ui/SaleActionsBar";
import { SaleCardList } from "@/contexts/sale-management/sale/presentation/ui/SaleCardList";
import { SaleDesktopTable } from "@/contexts/sale-management/sale/presentation/ui/SaleDesktopTable";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata = {
    title: 'Ventas'
}
export default async function(){
    const sales = await findAllSaleByBranchOfficeAction();
    const currentSales = sales?.value?.sales ?? [];
    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: 'ventas'
        }
    ]
    return (
        <ProtectedRoute requiredRoles={['global_admin','establishment_manager', 'branch_office_management']}>
            <TemplateHeader title="Ventas" detail="Vista general de ventas" breadcrumbItems={breadcrumbItems}>
                <SaleActionsBar
                    sales={currentSales}/>
                <div className="hidden md:block">
                    <SaleDesktopTable
                        sales={currentSales}/>
                </div>
                <div className="md:hidden mt-2 flex flex-col items-center gap-2 w-full">
                    <SaleCardList
                        sales={currentSales} />
                </div>
            </TemplateHeader>
        </ProtectedRoute>
    );
}