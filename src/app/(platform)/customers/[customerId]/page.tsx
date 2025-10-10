import { findOneCustomerByEstablishmentAction } from "@/features/customer/actions/find-one-customer-by-establishment.action";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { Metadata } from "next";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Perfil del cliente'
}

interface Props {
    params: {
        customerId: string;
    }
}

export default async function SaleInformationPage({ params }: Props) {
    const { customerId } = await params;

    const customer = await findOneCustomerByEstablishmentAction(BigInt(customerId));
    const data = customer?.value;
    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: 'clientes',
            href: '/customers'
        },
        {
            label: `${data?.firstName ?? ''} ${data?.lastName ?? ''}`
        }
    ]

    // Función de utilidad para formatear moneda
    const formatCurrency = (amount: number) => `$${parseFloat(amount.toString()).toFixed(2)}`;

    // Función para obtener el Badge de Status de la Venta (igual que antes)
    const getSaleStatusBadge = (status: 'completada' | 'pendiente') => {
        const statusText = status.charAt(0).toUpperCase() + status.slice(1);
        const classes = {
            'completada': 'bg-emerald-100 text-emerald-800 border-emerald-300',
            'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            // Agregar más si es necesario: 'cancelada': 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${classes[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusText}
            </span>
        );
    };
    return (
        <ProtectedRoute>
            <TemplateHeader title={`${data?.firstName ?? ''} ${data?.lastName ?? ''}`} detail="Información del perfil del cliente." breadcrumbItems={breadcrumbItems}>

                {/* LAYOUT PRINCIPAL: 1/3 Datos de Cliente y 2/3 Historial de Ventas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLUMNA PRINCIPAL (HISTORIAL DE VENTAS) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 3. HISTORIAL DE VENTAS (LISTA/TABLA) */}
                        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                                Historial de Compras Recientes
                            </h2>

                            {/* Lista de Ventas (Diseño tipo Tarjeta/Fila para mejor UX) */}
                            <div className="space-y-3">
                                {(data?.sales?.length ?? 0) > 0 ? (
                                    data?.sales?.map((sale) => (
                                        <div key={sale.saleId} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-100 transition-colors duration-150 cursor-pointer">

                                            {/* Información Principal */}
                                            <div>
                                                <p className="text-lg font-bold text-gray-800">Venta #{sale.saleId}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(sale.createdAt).toLocaleDateString()}
                                                    <span className="mx-2 text-gray-300">|</span>
                                                    {getSaleStatusBadge('completada')}
                                                </p>
                                            </div>

                                            {/* Monto y Acción */}
                                            <div className="text-right flex items-center space-x-4">
                                                <span className="text-xl font-extrabold text-blue-700">
                                                    {formatCurrency(sale.totalAmount)}
                                                </span>
                                                <button
                                                    // Usando tu color de acento naranja para la acción de detalles
                                                    className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                                                // onClick={() => alert(`Navegar a Detalle de Venta #${sale.saleId}`)}
                                                >
                                                    Ver Detalles
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic p-4 text-center">Aún no hay ventas registradas para este cliente.</p>
                                )}
                            </div>
                        </div>

                    </div>
                    {/* COLUMNA LATERAL (DATOS DEL CLIENTE) */}
                    <aside className="lg:col-span-1 space-y-6">

                        {/* 1. FICHA DE CONTACTO PRINCIPAL */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="text-blue-500 mr-2">🔗</span> Contacto Principal
                            </h2>

                            <dl className="text-sm space-y-3">
                                {/* Nombre Completo */}
                                <div>
                                    <dt className="font-semibold text-gray-600">Nombre Completo:</dt>
                                    <dd className="text-lg font-bold text-gray-900">{data?.firstName} {data?.lastName}</dd>
                                </div>

                                {/* Tipo de Cliente */}
                                <div className="pt-2 border-t border-gray-100">
                                    <dt className="font-semibold text-gray-600">Tipo de Cliente:</dt>
                                    <dd className="text-gray-800">{data?.customerType}</dd>
                                </div>

                                {/* Compañía/RFC */}
                                <div className="pt-2 border-t border-gray-100">
                                    <dt className="font-semibold text-gray-600">Compañía / RFC:</dt>
                                    <dd className="text-gray-800">{data?.companyName} / <span className="font-medium text-orange-600">{data?.rfc}</span></dd>
                                </div>

                                {/* Teléfono */}
                                <div className="pt-2 border-t border-gray-100">
                                    <dt className="font-semibold text-gray-600">Teléfono:</dt>
                                    <dd className="text-blue-600 hover:underline cursor-pointer">{data?.phoneNumber}</dd>
                                </div>

                                {/* Email */}
                                <div className="pt-2 border-t border-gray-100">
                                    <dt className="font-semibold text-gray-600">Email:</dt>
                                    <dd className="text-blue-600 hover:underline cursor-pointer break-all">{data?.email}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* 2. ESTADÍSTICAS DEL CLIENTE (Placeholder) */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                📊 Estadísticas
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-xs text-blue-700 font-semibold">Total Compras</p>
                                    <p className="text-2xl font-extrabold text-blue-900">{data?.sales?.length ?? 0}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <p className="text-xs text-orange-700 font-semibold">Monto Acumulado</p>
                                    <p className="text-lg font-extrabold text-orange-900">0</p>
                                </div>
                            </div>
                        </div>

                    </aside>

                </div>
            </TemplateHeader>
        </ProtectedRoute>
    )
}