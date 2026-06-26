import { findAllManyFilterTransactionsAction } from "@/contexts/transaction-management/transaction/presentation/actions/find-cash-movements-by-branch-office-id.action";
import { TransactionInformation } from "@/contexts/transaction-management/transaction/presentation/ui/TransactionInformation";
import { TransactionMovementsDesktopTable } from "@/contexts/transaction-management/transaction/presentation/ui/TransactionMovementsDesktopTable";
import { TransactionMovementsOptios } from "@/contexts/transaction-management/transaction/presentation/ui/TransactionMovementsOptios";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { Metadata } from "next";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Movimientos de caja'
}

export default async function SaleInformationPage() {
    const dto = {
        branchOfficeId: null,
        cashSessionId: null,
        dateEnd: null,
        dateInit: null,
        employeeId: null,
        saleId: null,
        transactionType: null,
    }
    const customer = await findAllManyFilterTransactionsAction(dto);
    const data = customer?.value?.transactions ?? [];

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: 'Movimientos Financieros',
        },
    ]

    return (
        <ProtectedRoute requiredRoles={['global_admin','establishment_manager', 'branch_office_management']}>
            <TemplateHeader title='Movimientos Financieros' detail="Consulta los movimientos de tu establecimiento." breadcrumbItems={breadcrumbItems}>
                <TransactionMovementsOptios
                    transactions={data} />
                <TransactionInformation />
                <div className="hidden md:block">
                    <TransactionMovementsDesktopTable />
                </div>
                <div className="md:hidden">
                    {/* <SaleCardList
                    sales={currentSales} /> */}
                </div>

            </TemplateHeader>
        </ProtectedRoute>
    )
}