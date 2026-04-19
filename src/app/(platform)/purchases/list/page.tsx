import { Metadata } from "next";
import { ProductActionsBar } from "@/contexts/product-management/product/presentation/ui/product-catalog/ProductActionsBar";
import { ProductSearch } from "@/contexts/product-management/product/presentation/ui/product-catalog/ProductSearch";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { LotActionsBar } from "@/contexts/purchase-management/lot/presentation/ui/lot-catalog/LotActionsBar";
import { findReportsLotsAction } from "@/contexts/purchase-management/lot/presentation/actions/find-report-lots.action";
import { TableLotsDesktop } from "@/contexts/purchase-management/lot/presentation/ui/lot-catalog/TableLotDesktop";
import { LotSearch } from "@/contexts/purchase-management/lot/presentation/ui/lot-catalog/LotSearch";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Compras'
}

export default async function ProductsPage() {

    // Llama al server action en el servidor con manejo de errores
    try {
        const response = await findReportsLotsAction(null, null);
        const items = response?.ok && response.value?.lots ? response.value.lots : [];

        const breadcrumbItems: BreadcrumbItem[] = [
            {label: 'Compras', href: '/purchases'},
            {label: 'Catalogo'},
        ]
        return (
            <ProtectedRoute>
                <TemplateHeader title="Catalogo de compras" detail="Lista de todas las compras realizadas" breadcrumbItems={breadcrumbItems}>
                    <main className="flex flex-col gap-4 w-full">
                        <LotActionsBar
                            data={items} />
                        <LotSearch />
                        <div className="max-lg:hidden block">
                            <TableLotsDesktop />
                        </div>
                    </main>
                </TemplateHeader>
            </ProtectedRoute>
        );
    } catch (error) {
        console.error('Error loading products page:', error);
        return (
            <ProtectedRoute>
                <main className="flex flex-col gap-4 w-full">
                    <ProductActionsBar data={[]} />
                    <ProductSearch />
                    <h1 className="text-xl">Lista de productos</h1>
                    <div className="w-full bg-gray-100 border border-gray-400 text-red-700 px-4 py-3 rounded">
                        Error al cargar los productos. Por favor, recarga la página.
                    </div>
                </main>
            </ProtectedRoute>
        );
    }
}