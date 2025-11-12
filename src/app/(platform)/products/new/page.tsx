import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { FindAllCategoriesByEstablishmentAction } from "@/features/category/actions/find-all-categories-by-stablishment.action";
import { findAllBrandsByEstablishmentAction } from "@/features/brand/actions/find-all-brands-by-establishment.action";
import { findAllSeasonsBYEstablishmentAction } from "@/features/season/actions/find-all-seasons-by-establishment.action";
import { FormRegisterCompleteProduct } from "@/features/product/ui/register-complete-product/FormRegisterCompleteProduct";

export default async function () {
    const viewAllCategories = await FindAllCategoriesByEstablishmentAction();
    const categoryItems = viewAllCategories.ok ? viewAllCategories.value?.categories ?? [] : [];
    const viewAllBrands = await findAllBrandsByEstablishmentAction();
    const brandItems = viewAllBrands.ok ? viewAllBrands.value?.brands ?? [] : [];
    const viewAllSeasons = await findAllSeasonsBYEstablishmentAction();
    const seasonItems = viewAllSeasons.ok ? viewAllSeasons.value?.seasons ?? [] : [];

    const breadcrumbItems: BreadcrumbItem[] = [
        {label: 'Productos', href: '/products'},
        {label: 'Producto e inventario'}
    ]
    return (
        <ProtectedRoute>
            <TemplateHeader title="Alta de productos e inventario" detail="Da de alta un producto con lote inicial e inventario." breadcrumbItems={breadcrumbItems}>
                <FormRegisterCompleteProduct
                    brandList={brandItems}
                    seasonList={seasonItems}
                    categoryList={categoryItems} />
            </TemplateHeader>
        </ProtectedRoute>
    );
}