import { findAllCashRegisterByBranchOfficeIdAction } from "@/contexts/cash-management/cash-register/presentation/actions/find-all-cash-register-by-branch-office-id.action";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { CashOptios } from "@/contexts/cash-management/cash-session/presentation/ui/CashOptios";
import { CashRegisterList } from "@/contexts/cash-management/cash-session/presentation/ui/CashRegisterList";

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
                <CashRegisterList 
                    cashRegisters={cashRegisters}/>
            </TemplateHeader>
        </ProtectedRoute>
    );
}