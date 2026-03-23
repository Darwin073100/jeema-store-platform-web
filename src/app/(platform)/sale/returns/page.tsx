import { findReturnsByBranchOfficeAction } from "@/contexts/sale-management/returns/presentation/actions/find-returns-by-branch-office.action";
import { ReturnsActionsBar } from "@/contexts/sale-management/returns/presentation/ui/ReturnsActionsBar";
import { ReturnsDesktopTable } from "@/contexts/sale-management/returns/presentation/ui/ReturnsDesktopTable";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";

export const metadata = {
    title: 'Devoluciones'
}
export default async function(){
    const returns = await findReturnsByBranchOfficeAction();
    const currentReturns = returns?.value?.returns ?? [];
    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: 'ventas',
            href: '/sale'
        },
        {
            label: 'devoluciones'
        }
    ]
    return (
        <ProtectedRoute>
            <TemplateHeader title="Devoluciones" detail="Vista general de devoluciones" breadcrumbItems={breadcrumbItems}>
                <ReturnsActionsBar
                    returns={currentReturns}/>
                <div className="hidden md:block">
                    <ReturnsDesktopTable
                        returns={currentReturns}/>
                </div>
                <div className="md:hidden">
                    {/* <SaleCardList
                        sales={currentSales} /> */}
                </div>
            </TemplateHeader>
        </ProtectedRoute>
    );
}