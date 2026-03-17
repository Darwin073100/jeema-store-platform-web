import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { FormRegisterCompleteProduct } from "@/contexts/product-management/product/presentation/ui/register-complete-product/FormRegisterCompleteProduct";
import { findAllSuplierByEstablishmentId } from "@/features/suplier/actions/find-all-suplier-by-establishment.action";
import { findAllCategoriesByEstablishmentAction } from "@/contexts/product-management/category/presentation/actions/find-all-categories-by-stablishment.action";
import { findAllBrandsByEstablishmentAction } from "@/contexts/product-management/brand/presentation/actions/find-all-brands-by-establishment.action";
import { findAllSeasonsByEstablishmentAction } from "@/contexts/product-management/season/presentation/actions/find-all-seasons-by-establishment.action";

export default async function () {
    const categories = await findAllCategoriesByEstablishmentAction();
    const brands = await findAllBrandsByEstablishmentAction();
    const seasons = await findAllSeasonsByEstablishmentAction();
    const suplierResponse = await findAllSuplierByEstablishmentId();
    const supliers = suplierResponse.value?.supliers?? [];

    const breadcrumbItems: BreadcrumbItem[] = [
        {label: 'Productos', href: '/products'},
        {label: 'Producto e inventario'}
    ]
    return (
        <ProtectedRoute>
            <TemplateHeader title="Alta de productos e inventario" detail="Da de alta un producto con lote inicial e inventario." breadcrumbItems={breadcrumbItems}>
                <FormRegisterCompleteProduct
                    brandList={brands}
                    seasonList={seasons}
                    categoryList={categories}
                    suplierList={supliers} />
            </TemplateHeader>
        </ProtectedRoute>
    );
}