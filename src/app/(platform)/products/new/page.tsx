import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { viewAllBrandsAction } from "@/features/brand/actions/view-all-brands.action";
import { ViewAllCategoriesAction } from "@/features/category/actions/view-all-categories.action";
import { FormNewProductAndInventory } from "@/features/product/ui/save-product-and-inventory/FormNewProductAndInventory";
import { viewAllSeasonsAction } from "@/features/season/actions/view-all-seasons.action";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";

export default async function () {
    const viewAllCategories = await ViewAllCategoriesAction();
    const categoryItems = viewAllCategories.ok ? viewAllCategories.value?.categories ?? [] : [];
    const viewAllBrands = await viewAllBrandsAction();
    const brandItems = viewAllBrands.ok ? viewAllBrands.value?.brands ?? [] : [];
    const viewAllSeasons = await viewAllSeasonsAction();
    const seasonItems = viewAllSeasons.ok ? viewAllSeasons.value?.seasons ?? [] : [];

    const breadcrumbItems: BreadcrumbItem[] = [
        {label: 'Productos', href: '/products'},
        {label: 'Producto e inventario'}
    ]
    return (
        <ProtectedRoute>
            <TemplateHeader title="Alta de productos e inventario" detail="Da de alta un producto con lote inicial e inventario." breadcrumbItems={breadcrumbItems}>
                <FormNewProductAndInventory
                    brandList={brandItems}
                    seasonList={seasonItems}
                    categoryList={categoryItems} />
            </TemplateHeader>
        </ProtectedRoute>
    );
}