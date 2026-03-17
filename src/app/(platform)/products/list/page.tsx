import { Metadata } from "next";
import { TableProduct } from "@/contexts/product-management/product/presentation/ui/product-catalog/TableProducts";
import { CategoryModal } from "@/features/category/ui/CategoryModal";
import { ProductActionsBar } from "@/contexts/product-management/product/presentation/ui/product-catalog/ProductActionsBar";
import { ProductSearch } from "@/contexts/product-management/product/presentation/ui/product-catalog/ProductSearch";
import { BrandModal } from "@/features/brand/ui/BrandModal";
import { SeasonModal } from "@/features/season/ui/SeasonModal";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { findAllBrandsByEstablishmentAction } from "@/features/brand/actions/find-all-brands-by-establishment.action";
import { FindAllCategoriesByEstablishmentAction } from "@/features/category/actions/find-all-categories-by-stablishment.action";
import { findAllSeasonsBYEstablishmentAction } from "@/features/season/actions/find-all-seasons-by-establishment.action";
import { ProductAudit } from "@/contexts/product-management/product/presentation/ui/product-catalog/ProductAudit";
import { findAllProductsByEstablishmentAction } from "@/contexts/product-management/product/presentation/actions/find-all-products-by-establishment.action";
import { ProductEntity } from "@/features/product/domain/entities/product.entity";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Productos'
}

export default async function ProductsPage() {

    // Llama al server action en el servidor con manejo de errores
    try {
        const inventoryItemsData = await findAllProductsByEstablishmentAction();
        const items = inventoryItemsData as ProductEntity[];

        const viewAllCategories = await FindAllCategoriesByEstablishmentAction();
        const categories = viewAllCategories?.ok && viewAllCategories.value?.categories ? viewAllCategories.value.categories : [];

        const viewAllBrands = await findAllBrandsByEstablishmentAction();
        const brandItems = viewAllBrands?.ok && viewAllBrands.value?.brands ? viewAllBrands.value.brands : [];

        const viewAllSeasons = await findAllSeasonsBYEstablishmentAction();
        const seasonItems = viewAllSeasons?.ok && viewAllSeasons.value?.seasons ? viewAllSeasons.value.seasons : [];

        const breadcrumbItems: BreadcrumbItem[] = [
            {label: 'Productos', href: '/products'},
            {label: 'Catalogo'},
        ]
        return (
            <ProtectedRoute>
                <TemplateHeader title="Catalogo de productos" detail="Lista de todos los productos en diferentes ubicaciones" breadcrumbItems={breadcrumbItems}>
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
                            brandList={brandItems}
                        />
                        <SeasonModal
                            seasonList={seasonItems} />
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