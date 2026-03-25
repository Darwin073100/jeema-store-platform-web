import { findAllCashRegisterByBranchOfficeIdAction } from "@/contexts/cash-management/cash-register/presentation/actions/find-all-cash-register-by-branch-office-id.action";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import CashRegisterItem from "@/contexts/cash-management/cash-session/presentation/ui/CashRegisterItem";
import { CashOptios } from "@/contexts/cash-management/cash-session/presentation/ui/CashOptios";

export const metadata = {
    title: 'Cajas'
}
export default async function(){
    const cashRegisterData = await findAllCashRegisterByBranchOfficeIdAction();
    const cashRegisters = cashRegisterData?.value?.cashRegisters ?? [];
    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: 'cajas'
        }
    ]
    return (
        <ProtectedRoute>
            <TemplateHeader title="Cajas" detail="Vista general de caja" breadcrumbItems={breadcrumbItems}>
                <CashOptios 
                    cashes={cashRegisters}/>
                <div className="grid grid-cols-4 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 justify-items-center gap-4">
                    {cashRegisters.map(item=> <>
                        <CashRegisterItem 
                            key={item.cashRegisterId}
                            cashRegister={item}/>
                    </>)}
                </div>
            </TemplateHeader>
        </ProtectedRoute>
    );
}