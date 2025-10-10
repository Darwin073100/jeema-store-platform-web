import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { Metadata } from "next";
import { Button } from "@/ui/components/buttons";
import Link from "next/link";
import { viewProductByIdAction } from "@/features/product/actions/view-product-by-id.action";
import { ProductDetailsView } from "@/features/product/ui/product-detail/ProductDetailsView";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { FcPaid, FcSearch, FcSurvey } from "react-icons/fc";
import { findSaleInfoByIdAction } from "@/features/sale/actions/find-sale-info-by-id.action";
import { SaleStatusEnum } from "@/features/sale/domain/enums/sale-status.enum";

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
        // Función de utilidad para formatear moneda
        const formatCurrency = (amount: any) => `$${parseFloat(amount).toFixed(2)}`;

        // Función de utilidad para Badge (usando el verde esmeralda para 'completada')
        const getStatusBadge = (status: SaleStatusEnum) => {
            const statusText = status.charAt(0).toUpperCase() + status.slice(1);
            const classes = status === SaleStatusEnum.COMPLETED ? 'bg-emerald-100 text-emerald-800' : status === SaleStatusEnum.CANCELLED ? 'bg-red-100 text-red-800' : status === SaleStatusEnum.PENDING ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
            return (
                <span className={`px-3 py-1 text-sm font-semibold rounded-full uppercase ${classes}`}>
                    {statusText}
                </span>
            );
        };

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
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            {getStatusBadge(data.status)}
                            {/* Botones de acción */}
                            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                                Reimprimir ticket de la venta
                            </button>
                        </div>
                        <h1 className="text-3xl font-extrabold text-blue-600">
                        </h1>
                    </div>

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
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="text-xs text-gray-600 uppercase bg-blue-50/50 font-semibold sticky top-0"> {/* Fondo ligeramente azul para la cabecera */}
                                            <tr>
                                                <th scope="col" className="px-4 py-3">Producto</th>
                                                <th scope="col" className="px-4 py-3 text-right">Cant.</th>
                                                <th scope="col" className="px-4 py-3 text-right text-orange-600">P. Unitario</th>
                                                <th scope="col" className="px-4 py-3 text-right">Descuento</th>
                                                <th scope="col" className="px-4 py-3 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.saleDetails?.map(item => (
                                                <tr
                                                    key={item.saleDetailId}
                                                    className="bg-white border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-150" // Efecto hover sutil
                                                >
                                                    <td className="px-4 py-3">
                                                        <p className="font-semibold text-gray-800">{item.productNameAtSale}</p>
                                                        <p className="text-xs text-gray-500">Marca: {item.productBrandAtSale} | Código: {item.productBarCodeAtSale}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-orange-600">
                                                        {formatCurrency(item.unitPriceAtSale)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-red-600">
                                                        -{formatCurrency(item.discountItem)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                        {formatCurrency(item.subtotalItem)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 2. RESUMEN FINANCIERO (TOTALES) - SEGUNDO EN LA COLUMNA */}
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    Resumen Financiero
                                </h2>
                                {/* ... (Contenido de totales sigue igual) ... */}
                                <div className="p-4 bg-gray-50 rounded-lg">

                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-700">Subtotal (sin IVA):</span>
                                        <span className="font-medium text-gray-800">{formatCurrency(data.subTotalAmount)}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-700">Impuestos (IVA):</span>
                                        <span className="font-medium text-gray-800">{formatCurrency(data.taxAmount)}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-700">Descuento Total:</span>
                                        <span className={`font-medium ${parseFloat(data?.discountAmount.toString()) > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                            -{formatCurrency(data.discountAmount)}
                                        </span>
                                    </div>

                                    <div className="pt-3 mt-3 border-t border-gray-300 flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-800">TOTAL FINAL:</span>
                                        <span className="text-3xl font-extrabold text-blue-700">
                                            {formatCurrency(data.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* COLUMNA LATERAL (DATOS DE CONTEXTO) - ORDEN NORMAL (SE MANTIENE EN LA DERECHA) */}
                        <aside className="lg:col-span-1 space-y-6">

                            {/* 3. DATOS DEL CLIENTE */}
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                                {/* ... (Contenido de Cliente sigue igual) ... */}
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-500/50">
                                    Datos del Cliente
                                </h2>
                                <dl className="text-sm">
                                    <div className="py-2">
                                        <dt className="font-semibold text-gray-600">Nombre:</dt>
                                        <dd className="text-gray-800">{data?.customer?.firstName} {data?.customer?.lastName}</dd>
                                    </div>
                                    <div className="py-2 border-t border-gray-100">
                                        <dt className="font-semibold text-gray-600">Empresa:</dt>
                                        <dd className="text-gray-800">{data?.customer?.companyName}</dd>
                                    </div>
                                    <div className="py-2 border-t border-gray-100">
                                        <dt className="font-semibold text-gray-600">Teléfono:</dt>
                                        <dd className="text-blue-600 hover:underline">{data?.customer?.phoneNumber}</dd>
                                    </div>
                                </dl>
                                <button className="mt-4 w-full py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                                    Ver Perfil de Cliente
                                </button>
                            </div>

                            {/* 4. DATOS DEL EMPLEADO Y TIEMPO */}
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                                {/* ... (Contenido de Transacción sigue igual) ... */}
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    Información de la Transacción
                                </h2>
                                <dl className="text-sm">
                                    <div className="py-2">
                                        <dt className="font-semibold text-gray-600">Vendedor:</dt>
                                        <dd className="text-gray-800">{data?.employee?.firstName} {data?.employee?.lastName}</dd>
                                    </div>
                                    <div className="py-2 border-t border-gray-100">
                                        <dt className="font-semibold text-gray-600">Fecha de Venta:</dt>
                                        <dd className="text-gray-800">{new Date(data.createdAt).toLocaleDateString()}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* 5. PAGOS REALIZADOS */}
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                                {/* ... (Contenido de Pagos sigue igual) ... */}
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    Pagos
                                </h2>
                                {data.salePayments?.map(p => (
                                    <div key={p.salePaymentId} className="py-2 px-3 mb-2 rounded-md bg-blue-50 border-l-4 border-blue-400">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-gray-700">{p?.paymentMethod?.name}</span>
                                            <span className="font-bold text-gray-900">{formatCurrency(p.amountPaid)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

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
