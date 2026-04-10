import { findCashSessionByEmployeeIdAction } from "@/contexts/cash-management/cash-session/presentation/actions/find-cash-session-by-employee-id.action";
import { findAllInventoryItemsByLocationAndBranchOfficeAction } from "@/contexts/inventory-management/inventory-item/presentation/actions/find-all-inventory-items-by-location-and-branch-office.action";
import { findAllCustomerByEstablishmentAction } from "@/contexts/sale-management/customer/presentation/actions/find-all-customer-by-establishment.action";
import { findAllPaymentMethodAction } from "@/contexts/sale-management/payment-method/presentation/actions/find-all-payment-method.action";
import { SaleMessages } from "@/contexts/sale-management/sale/presentation/ui/SaleMessages";
import { SaleProductList } from "@/contexts/sale-management/sale/presentation/ui/SaleProductList";
import { SaleProductSearch } from "@/contexts/sale-management/sale/presentation/ui/SaleProductSearch";
import { SaleSummary } from "@/contexts/sale-management/sale/presentation/ui/SaleSummary";
import { SaleSummaryMovile } from "@/contexts/sale-management/sale/presentation/ui/SaleSummaryMovile";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader"

export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata = {
    title: 'Nueva venta'
}

const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Ventas', href: '/sale' },
    { label: 'Nueva Venta' }
];

export default async function() {
    const resultPaymentMethods = await findAllPaymentMethodAction();
    const currentPaymentMethods = resultPaymentMethods.value?.paymentMethods ?? [];
    const resultCustomers = await findAllCustomerByEstablishmentAction();
    const currentCustomers = resultCustomers?.value?.customers ?? [];
    const resultCashSession = await findCashSessionByEmployeeIdAction();
    const currentCashSession = resultCashSession.value ?? null;

    return (
        <ProtectedRoute>
            <TemplateHeader 
                breadcrumbItems={breadcrumbItems} 
                title={currentCashSession?.cashRegister? currentCashSession.cashRegister.name: 'Caja no aperturada' } 
                detail="Agrega productos a la venta usando el código de barras o búsqueda manual." >
                {/* Potential Component: SaleProductSearch */}
                <SaleProductSearch
                    cashSession={currentCashSession} />
                <article className="flex gap-6 items-start w-full mt-6">
                    {/* Potential Component: SaleProductList */}
                    <SaleProductList />
                    {/* Potential Component: SaleSummary */}
                    <SaleSummary 
                        customers={currentCustomers}
                        paymentMethods={currentPaymentMethods} />
                </article>
                <SaleSummaryMovile
                    customers={currentCustomers}
                    paymentMethods={currentPaymentMethods} />

                <SaleMessages />
            </TemplateHeader>
        </ProtectedRoute>
    )
} 