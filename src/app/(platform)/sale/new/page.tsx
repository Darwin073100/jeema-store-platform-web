import { findCashSessionByEmployeeIdAction } from "@/features/cash/actions/find-cash-session-by-employee-id.action";
import { findAllCustomerByEstablishmentAction } from "@/features/customer/actions/find-all-customer-by-establishment.action";
import { findAllInventoryItemsByLocationAndBranchOfficeAction } from "@/features/inventory/actions/find-all-inventory-items-by-location-and-branch-office.action";
import { findAllPaymentMethodAction } from "@/features/payment-method/actions/find-all-payment-method.action";
import { SaleMessages } from "@/features/sale/ui/SaleMessages";
import { SaleProductList } from "@/features/sale/ui/SaleProductList";
import { SaleProductSearch } from "@/features/sale/ui/SaleProductSearch";
import { SaleSummary } from "@/features/sale/ui/SaleSummary";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader"

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
    const resultInventoryItemsList = await findAllInventoryItemsByLocationAndBranchOfficeAction();
    const currentInventoryItems = resultInventoryItemsList?.value?.items ?? [];
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
                        inventoryItems={currentInventoryItems}
                        customers={currentCustomers}
                        paymentMethods={currentPaymentMethods} />
                </article>
                <SaleMessages />
            </TemplateHeader>
        </ProtectedRoute>
    )
} 