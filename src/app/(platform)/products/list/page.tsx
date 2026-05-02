import { Metadata } from "next";
import { TableProduct } from "@/contexts/product-management/product/presentation/ui/product-catalog/TableProducts";
import { CategoryModal } from "@/contexts/product-management/category/presentation/ui/CategoryModal";
import { ProductActionsBar } from "@/contexts/product-management/product/presentation/ui/product-catalog/ProductActionsBar";
import { ProductSearch } from "@/contexts/product-management/product/presentation/ui/product-catalog/ProductSearch";
import { BrandModal } from "@/contexts/product-management/brand/presentation/ui/BrandModal";
import { SeasonModal } from "@/contexts/product-management/season/presentation/ui/SeasonModal";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { ProductAudit } from "@/contexts/product-management/product/presentation/ui/product-catalog/ProductAudit";
import { findAllProductsByEstablishmentAction } from "@/contexts/product-management/product/presentation/actions/find-all-products-by-establishment.action";
import { findAllCategoriesByEstablishmentAction } from "@/contexts/product-management/category/presentation/actions/find-all-categories-by-stablishment.action";
import { findAllBrandsByEstablishmentAction } from "@/contexts/product-management/brand/presentation/actions/find-all-brands-by-establishment.action";
import { findAllSeasonsByEstablishmentAction } from "@/contexts/product-management/season/presentation/actions/find-all-seasons-by-establishment.action";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Productos'
}

export default async function ProductsPage() {

    // Llama al server action en el servidor con manejo de errores
    try {
        // const inventoryItemsData = await findAllProductsByEstablishmentAction();
        // const items = inventoryItemsData as IProduct[];
        const items = [];

        const categories = await findAllCategoriesByEstablishmentAction();
        const brands = await findAllBrandsByEstablishmentAction();
        const seasons = await findAllSeasonsByEstablishmentAction();

        const breadcrumbItems: BreadcrumbItem[] = [
            {label: 'Productos', href: '/products'},
            {label: 'Catalogo'},
        ]
        return (
            <ProtectedRoute>
                <TemplateHeader title="Catalogo de productos" 
                    detail="Lista de todos los productos en diferentes ubicaciones, para mostrar todo los productos ingresa * y da enter, para volver al estado anterior deja la caja de texto en blancoy dar enter." 
                    breadcrumbItems={breadcrumbItems}>
                    <main className="flex flex-col gap-4 w-full">
                        <ProductActionsBar
                            data={items} />
                        <ProductSearch />
                        <ProductAudit />
                        <TableProduct />
                        <CategoryModal
                            categoryList={categories}
                        />
                        <BrandModal
                            brandList={brands}
                        />
                        <SeasonModal
                            seasonList={seasons} />
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