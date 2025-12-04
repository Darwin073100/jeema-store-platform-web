import { findCashMovementsByBranchOfficeIdAction } from "@/features/cash/actions/find-cash-movements-by-branch-office-id.action";
import { CashMovementsDesktopTable } from "@/features/cash/presentation/ui/CashMovementsDesktopTable";
import { CashMovementsOptios } from "@/features/cash/presentation/ui/CashMovementsOptios";
import { findOneCustomerByEstablishmentAction } from "@/features/customer/actions/find-one-customer-by-establishment.action";
import { CustomerSaleList } from "@/features/customer/presentation/ui/details/CustomerSaleList";
import { Button } from "@/shared/ui/components/buttons";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic";
import { Metadata } from "next";
import Link from "next/link";
import { FcComboChart, FcLink, FcTimeline } from "react-icons/fc";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Movimientos de caja'
}

export default async function SaleInformationPage() {
    const customer = await findCashMovementsByBranchOfficeIdAction();
    const data = customer?.value?.cashSessions ?? [];

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: 'Cajas',
            href: '/cash'
        },
        {
            label: `Movimientos`
        }
    ]

    return (
        <ProtectedRoute>
            <TemplateHeader title='Movimeintos' detail="Consulta las aperturas y cierres de caja." breadcrumbItems={breadcrumbItems}>
                <CashMovementsOptios
                    cashSessions={data} />
                <div className="hidden md:block">
                    <CashMovementsDesktopTable
                        cashSessions={data} />
                </div>
                <div className="md:hidden">
                    {/* <SaleCardList
                    sales={currentSales} /> */}
                </div>

            </TemplateHeader>
        </ProtectedRoute>
    )
}