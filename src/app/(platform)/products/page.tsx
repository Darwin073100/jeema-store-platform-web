import { Button } from "@/ui/components/buttons";
import { TextInput } from "@/ui/components/inputs";
import { Metadata } from "next";
import { IoMdAdd } from "react-icons/io";
import { MdCategory, MdOutlineViewTimeline } from "react-icons/md";
import { TableProduct } from "@/features/inventory/ui/TableProducts";
import { FaSearch } from "react-icons/fa";
import { CategoryModal } from "@/features/category/ui/CategoryModal";
import { viewAllInventoryItem } from "@/features/inventory/actions/view-all-inventory-item.action";
import { ProductActionsBar } from "@/features/product/ui/ProductActionsBar";
import { ProductSearch } from "@/features/product/ui/ProductSearch";
import { viewAllProductsAction } from "@/features/product/actions/view-all-products.action";
import { ViewAllCategoriesAction } from "@/features/category/actions/view-all-categories.action";
import { viewAllBrandsAction } from "@/features/brand/actions/view-all-brands.action";
import { BrandModal } from "@/features/brand/ui/BrandModal";
import { SeasonModal } from "@/features/season/ui/SeasonModal";
import { viewAllSeasonsAction } from "@/features/season/actions/view-all-seasons.action";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { Breadcrumb } from "@/ui/components/navigation";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Productos'
}

export default async function ProductsPage() {

    // Llama al server action en el servidor con manejo de errores
    try {
        const inventoryItemsData = await viewAllProductsAction();
        const items = inventoryItemsData?.ok && inventoryItemsData.value?.products ? inventoryItemsData.value.products : [];

        const viewAllCategories = await ViewAllCategoriesAction();
        const categories = viewAllCategories?.ok && viewAllCategories.value?.categories ? viewAllCategories.value.categories : [];

        const viewAllBrands = await viewAllBrandsAction();
        const brandItems = viewAllBrands?.ok && viewAllBrands.value?.brands ? viewAllBrands.value.brands : [];

        const viewAllSeasons = await viewAllSeasonsAction();
        const seasonItems = viewAllSeasons?.ok && viewAllSeasons.value?.seasons ? viewAllSeasons.value.seasons : [];

        const breadcrumbItems: BreadcrumbItem[] = [
            {label: 'Productos'}
        ]
        return (
            <ProtectedRoute>
                <TemplateHeader title="Catalogo de productos" detail="Lista de todos los productos en diferentes ubicaciones" breadcrumbItems={breadcrumbItems}>
                    <main className="flex flex-col gap-4 w-full">
                        <ProductActionsBar />
                        <ProductSearch />
                        <TableProduct
                            productList={items} />
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
                    <ProductActionsBar />
                    <ProductSearch />
                    <h1 className="text-xl">Lista de productos</h1>
                    <div className="w-full bg-gray-100 border border-gray-400 text-red-700 px-4 py-3 rounded">
                        Error al cargar los productos. Por favor, recarga la página.
                    </div>
                    <TableProduct productList={[]} />
                    <CategoryModal categoryList={[]} />
                    <BrandModal brandList={[]} />
                    <SeasonModal seasonList={[]} />
                </main>
            </ProtectedRoute>
        );
    }
}