import { findAllSaleByBranchOfficeAction } from "@/features/sale/actions/find-all-sale-by-branch-office.action";
import { SaleCardList } from "@/features/sale/ui/SaleCardList";
import { SaleDesktopTable } from "@/features/sale/ui/SaleDesktopTable";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";

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
        <ProtectedRoute>
            <TemplateHeader title="Ventas" detail="Vista general de ventas" breadcrumbItems={breadcrumbItems}>
                <div className="hidden md:block">
                    <SaleDesktopTable
                        sales={currentSales}/>
                </div>
                <div className="md:hidden">
                    <SaleCardList
                        sales={currentSales} />
                </div>
            </TemplateHeader>
        </ProtectedRoute>
    );
}