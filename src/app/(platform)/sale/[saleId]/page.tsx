import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { Metadata } from "next";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { FcSurvey } from "react-icons/fc";
import { findSaleInfoByIdAction } from "@/features/sale/actions/find-sale-info-by-id.action";
import { HeaderDetail } from "@/features/sale/ui/detail/HeaderDetail";
import { SaleDetailList } from "@/features/sale/ui/detail/SaleDetailList";
import { FinancialSummary } from "@/features/sale/ui/detail/FinancialSummary";
import { SaleCustomerInfo } from "@/features/sale/ui/detail/SaleCustomerInfo";
import { SaleEmployeeInfo } from "@/features/sale/ui/detail/SaleEmployeeInfo";
import { SalePayments } from "@/features/sale/ui/detail/SalePayments";
import { findAllPaymentMethodAction } from "@/features/payment-method/actions/find-all-payment-method.action";
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
// export const revalidate = 0; // Revalidar en cada request
// export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Detalles del Producto'
}

interface Props {
    params: {
        saleId: string;
    }
}

export default async function ({ params }: Props) {
    try {
        const { saleId } = await params;
        const breadcrumbItems: BreadcrumbItem[] = [
            {
                label: 'ventas',
                href: '/sale'
            },
            {
                label: `Venta #${saleId ?? 'N/A'}`
            }
        ]

        // Obtener los detalles del producto
        const saleResult = await findSaleInfoByIdAction(BigInt(saleId));
        const methods = await findAllPaymentMethodAction();
        const currentMethods = methods?.value?.paymentMethods ?? [];

        if (!saleResult.ok || !saleResult.value) {
            return (
                <ProtectedRoute>
                    <TemplateNotFoundDinamic 
                        title="¡Oops! No pudimos encontrar la informacion de la venta"
                        description="La venta solicitada no existe en nuestra base de datos o no se pudo cargar en este momento."
                        linkHref="/sale"
                        linkText="Volver a la lista de ventas"/>
                </ProtectedRoute>
            );
        }

        const data = saleResult.value;

        return (
            <ProtectedRoute>
                <TemplateHeader title={`Folio de la venta #${saleId}`} detail="Vista general de ventas" breadcrumbItems={breadcrumbItems}>
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
                <TemplateNotFoundDinamic 
                    title="¡Oops! No pudimos encontrar la informacion de la venta"
                    description="La venta solicitada no existe en nuestra base de datos o no se pudo cargar en este momento."
                    linkHref="/sale"
                    linkText="Volver a la lista de ventas"/>
            </ProtectedRoute>
        );
    }
}
