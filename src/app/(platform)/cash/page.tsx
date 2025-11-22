import { findAllCashRegisterByBranchOfficeIdAction } from "@/features/cash/actions/find-all-cash-register-by-branch-office-id.action";
import { LiaCashRegisterSolid } from "react-icons/lia";
import { ButtonOutLine } from "@/ui/components/buttons/ButtonOutLine";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import CashRegisterItem from "@/features/cash/presentation/ui/CashRegisterItem";

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
                <div className="flex gap-4">
                    <ButtonOutLine><LiaCashRegisterSolid />Agregar nueva caja</ButtonOutLine>
                </div>
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