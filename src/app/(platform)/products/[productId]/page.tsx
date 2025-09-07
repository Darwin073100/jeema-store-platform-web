import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { Metadata } from "next";
import { Button } from "@/ui/components/buttons";
import Link from "next/link";
import { viewProductByIdAction } from "@/features/product/actions/view-product-by-id.action";
import { ProductDetailsView } from "@/features/product/ui/product-detail/ProductDetailsView";

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
    const { productId } = await params;
    
    // Obtener los detalles del producto
    const productResult = await viewProductByIdAction(productId);
    
    if (!productResult.ok || !productResult.value) {
        return (
            <ProtectedRoute>
                <main className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50 p-4">                    
                    <div className="bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-300 text-red-800 px-6 py-8 rounded-xl shadow-lg text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-xl font-bold mb-2">¡Oops! No pudimos encontrar este producto</h2>
                        <p className="text-red-700">El producto solicitado no existe en nuestra base de datos o no se pudo cargar en este momento.</p>
                        <div className="mt-6">
                            <Link href="/products">
                                <Button color="red" className="shadow-md hover:shadow-lg transition-shadow duration-200">
                                    🏠 Volver a la lista de productos
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </ProtectedRoute>
        );
    }

    const product = productResult.value;

    return (
        <ProtectedRoute>
            <ProductDetailsView product={product} />
        </ProtectedRoute>
    );
}
