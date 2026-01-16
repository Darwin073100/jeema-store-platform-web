import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { Metadata } from "next";
import { viewProductByIdAction } from "@/features/product/actions/view-product-by-id.action";
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import ProductDetail from "@/features/product/ui/product-detail/ProductDetail";
import InventoryDetail from "@/features/product/ui/product-detail/InventoryDetail";
import LotDetail from "@/features/product/ui/product-detail/LotDetail";
import { findAllSuplierByEstablishmentId } from "@/features/suplier/actions/find-all-suplier-by-establishment.action";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Detalles del Producto'
}


interface Props {
    params: {
        productId: string;
    }
}
export default async function ProductDetailsPage({ params }: Props) {
    try {
        const { productId } = await params;

        // Obtener los detalles del producto
        const productResult = await viewProductByIdAction(BigInt(productId));
        const suplierResponse = await findAllSuplierByEstablishmentId();
        const supliers = suplierResponse.value?.supliers?? [];

        if (!productResult.ok || !productResult.value) {
            return (
                <ProtectedRoute>
                    <TemplateNotFoundDinamic
                        linkHref="/products"
                        linkText="Volver a la lista de productos"
                        title="¡Oops! No pudimos encontrar este producto"
                        description="El producto solicitado no existe en nuestra base de datos o no se pudo cargar en este momento." />
                </ProtectedRoute>
            );
        }

        const product = productResult.value;

        const breadcrumbItems: BreadcrumbItem[] = [
            { label: 'Productos', href: '/products' },
            { label: 'Catalogo', href: '/products/list' },
            { label: product.name }
        ];

        return (
            <ProtectedRoute>
                <TemplateHeader title={product.name} detail='Detalles del producto' breadcrumbItems={breadcrumbItems}>
                    <ProductDetail product={product} />
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <InventoryDetail product={product} />
                    </div>
                    <LotDetail 
                        product={product} 
                        supliers={supliers}/>
                </TemplateHeader>
            </ProtectedRoute>
        );
    } catch {
        return (
            <ProtectedRoute>
                <TemplateNotFoundDinamic
                    linkHref="/products"
                    linkText="Volver a la lista de productos."
                    title="¡Oops! No pudimos encontrar este producto"
                    description="El producto solicitado no existe en nuestra base de datos o no se pudo cargar en este momento." />
            </ProtectedRoute>
        );
    }
}
