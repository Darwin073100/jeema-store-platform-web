import { SaleProductList } from "@/features/sale/ui/SaleProductList";
import { SaleProductSearch } from "@/features/sale/ui/SaleProductSearch";
import { SaleSummary } from "@/features/sale/ui/SaleSummary";
import { Button } from "@/ui/components/buttons";
import { TextInput } from "@/ui/components/inputs";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader"
import { IoIosBarcode, IoIosCash, IoIosPerson, IoIosSearch, IoIosTrash, IoMdCheckmark } from "react-icons/io";

export const metadata = {
    title: 'Nueva venta'
}

const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Ventas', href: '/sale' },
    { label: 'Nueva Venta' }
];

export default function() {
    return (
        <ProtectedRoute>
            <TemplateHeader breadcrumbItems={breadcrumbItems} title="Nueva Venta" detail="Agrega productos a la venta usando el código de barras o búsqueda manual." >
                {/* Potential Component: SaleProductSearch */}
                <SaleProductSearch />
                <article className="flex gap-6 items-start w-full mt-6">
                    {/* Potential Component: SaleProductList */}
                    <SaleProductList />
                    {/* Potential Component: SaleSummary */}
                    <SaleSummary />
                </article>
            </TemplateHeader>
        </ProtectedRoute>
    )
} 