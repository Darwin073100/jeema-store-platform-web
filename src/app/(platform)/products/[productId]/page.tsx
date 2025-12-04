import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { Metadata } from "next";
import { viewProductByIdAction } from "@/features/product/actions/view-product-by-id.action";
import { ProductDetailsView } from "@/features/product/ui/product-detail/ProductDetailsView";
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic";

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

        return (
            <ProtectedRoute>
                <ProductDetailsView product={product} />
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
