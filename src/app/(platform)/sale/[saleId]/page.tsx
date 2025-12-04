import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { Metadata } from "next";
import { Button } from "@/shared/ui/components/buttons";
import Link from "next/link";
import { viewProductByIdAction } from "@/features/product/actions/view-product-by-id.action";
import { ProductDetailsView } from "@/features/product/ui/product-detail/ProductDetailsView";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { FcPaid, FcSearch, FcSurvey } from "react-icons/fc";
import { findSaleInfoByIdAction } from "@/features/sale/actions/find-sale-info-by-id.action";
import { SaleStatusEnum } from "@/features/sale/domain/enums/sale-status.enum";
import { HeaderDetail } from "@/features/sale/ui/detail/HeaderDetail";
import { SaleDetailList } from "@/features/sale/ui/detail/SaleDetailList";
import { FinancialSummary } from "@/features/sale/ui/detail/FinancialSummary";
import { numberBasicFormat, numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import { SaleCustomerInfo } from "@/features/sale/ui/detail/SaleCustomerInfo";
import { formatDate } from "@/shared/lib/utils/date-formatter";
import { SaleEmployeeInfo } from "@/features/sale/ui/detail/SaleEmployeeInfo";
import { SalePayments } from "@/features/sale/ui/detail/SalePayments";
import { findAllPaymentMethodAction } from "@/features/payment-method/actions/find-all-payment-method.action";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Detalles del Producto'
}

interface Props {
    params: {
        saleId: string;
    }
}

export default async function SaleInformationPage({ params }: Props) {
    try {
        const breadcrumbItems: BreadcrumbItem[] = [
            {
                label: 'ventas',
                href: '/sale'
            },
            {
                label: `Venta #${params.saleId}`
            }
        ]
        const { saleId } = await params;

        // Obtener los detalles del producto
        const saleResult = await findSaleInfoByIdAction(BigInt(saleId));
        const methods = await findAllPaymentMethodAction();
        const currentMethods = methods?.value?.paymentMethods ?? [];

        if (!saleResult.ok || !saleResult.value) {
            return (
                <ProtectedRoute>
                    <main className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50 p-4">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-300 text-red-800 px-6 py-8 rounded-xl shadow-lg text-center">
                            <div className="text-6xl mb-4 flex w-full justify-center"><FcSearch /></div>
                            <h2 className="text-xl font-bold mb-2">¡Oops! No pudimos encontrar la informacion de la venta</h2>
                            <p className="text-red-700">La venta solicitada no existe en nuestra base de datos o no se pudo cargar en este momento.</p>
                            <div className="mt-6">
                                <Link href="/sale">
                                    <Button color="red">
                                        <span><FcPaid /></span> Volver a la lista de ventas
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </main>
                </ProtectedRoute>
            );
        }

        const data = saleResult.value;

        return (
            <ProtectedRoute>
                <TemplateHeader title={`Folio de la venta #${params.saleId}`} detail="Vista general de ventas" breadcrumbItems={breadcrumbItems}>
                    {/* ENCABEZADO Y ACCIONES PRINCIPALES */}
                    <HeaderDetail 
                        sale={data}
                        paymentMethods={currentMethods}/>

                    {/* LAYOUT PRINCIPAL: 2/3 Productos/Totales y 1/3 Cliente/Empleado */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* COLUMNA PRINCIPAL (PRODUCTOS Y TOTALES) - MANTENIENDO EL ORDEN INVERTIDO */}
                        <div className="lg:col-span-2 space-y-6 order-last lg:order-first"> {/* Agregado 'order-last' para mover la columna abajo en móvil, pero 'lg:order-first' para mantenerla arriba en escritorio */}

                            {/* 1. SECCIÓN DE PRODUCTOS VENDIDOS (TABLA) - EN LA PARTE SUPERIOR */}
                            <div className="bg-white p-5 rounded-xl shadow-xl border border-blue-100/70"> {/* Sombra más fuerte y borde sutil azul para destacarla */}
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                                    <FcSurvey /> <span>Artículos de la Venta ({data.saleDetails?.length ?? 'N/A'})</span>
                                </h2>

                                {/* Contenedor responsivo para scroll horizontal */}
                                <SaleDetailList 
                                    data={data}/>
                            </div>

                            {/* 2. RESUMEN FINANCIERO (TOTALES) - SEGUNDO EN LA COLUMNA */}
                                <FinancialSummary 
                                    data={data} />
                        </div>

                        {/* COLUMNA LATERAL (DATOS DE CONTEXTO) - ORDEN NORMAL (SE MANTIENE EN LA DERECHA) */}
                        <aside className="lg:col-span-1 space-y-6">

                            {/* 3. DATOS DEL CLIENTE */}
                            <SaleCustomerInfo 
                                data={data}/>

                            {/* 4. DATOS DEL EMPLEADO Y TIEMPO */}
                            <SaleEmployeeInfo 
                                data={data}/>

                            {/* 5. PAGOS REALIZADOS */}
                            <SalePayments 
                                data={data}/>

                        </aside>
                    </div>
                </TemplateHeader>
            </ProtectedRoute>
        );
    } catch (error) {
        return (
            <ProtectedRoute>
                <main className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50 p-4">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-300 text-red-800 px-6 py-8 rounded-xl shadow-lg text-center">
                        <div className="text-6xl mb-4 flex w-full justify-center"><FcSearch /></div>
                        <h2 className="text-xl font-bold mb-2">¡Oops! No pudimos encontrar la informacion de la venta</h2>
                        <p className="text-red-700">La venta solicitada no existe en nuestra base de datos o no se pudo cargar en este momento.</p>
                        <div className="mt-6">
                            <Link href="/sale">
                                <Button color="red">
                                    <span><FcPaid /></span> Volver a la lista de ventas
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </ProtectedRoute>
        );
    }
}
