import { findAllPaymentMethodAction } from "@/features/payment-method/actions/find-all-payment-method.action";
import { SaleProductList } from "@/features/sale/ui/SaleProductList";
import { SaleProductSearch } from "@/features/sale/ui/SaleProductSearch";
import { SaleSummary } from "@/features/sale/ui/SaleSummary";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader"

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
    
    return (
        <ProtectedRoute>
            <TemplateHeader breadcrumbItems={breadcrumbItems} title="Nueva Venta" detail="Agrega productos a la venta usando el código de barras o búsqueda manual." >
                {/* Potential Component: SaleProductSearch */}
                <SaleProductSearch />
                <article className="flex gap-6 items-start w-full mt-6">
                    {/* Potential Component: SaleProductList */}
                    <SaleProductList />
                    {/* Potential Component: SaleSummary */}
                    <SaleSummary 
                        paymentMethods={currentPaymentMethods} />
                </article>
            </TemplateHeader>
        </ProtectedRoute>
    )
} 