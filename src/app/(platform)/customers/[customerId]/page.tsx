import { findOneCustomerByEstablishmentAction } from "@/contexts/sale-management/customer/presentation/actions/find-one-customer-by-establishment.action";
import { CustomerSaleList } from "@/contexts/sale-management/customer/presentation/ui/details/CustomerSaleList";
import { Button } from "@/shared/ui/components/buttons";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { Metadata } from "next";
import Link from "next/link";
import { FcComboChart, FcLink, FcTimeline } from "react-icons/fc";

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
    try {
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

        if (!customer?.ok || !data) {
            return (
                <ProtectedRoute>
                    <main className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50 p-4">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-300 text-red-800 px-6 py-8 rounded-xl shadow-lg text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <h2 className="text-xl font-bold mb-2">¡Oops! No pudimos encontrar la informacion del cliente</h2>
                            <p className="text-red-700">El perfil del usuario no existe en nuestra base de datos o no se pudo cargar en este momento.</p>
                            <div className="mt-6">
                                <Link href="/customers">
                                    <Button color="red">
                                        🏠 Volver a la lista de clientes
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </main>
                </ProtectedRoute>
            );
        }
        return (
            <ProtectedRoute>
                <TemplateHeader title={`${data?.firstName ?? ''} ${data?.lastName ?? ''}`} detail="Información del perfil del cliente." breadcrumbItems={breadcrumbItems}>

                    {/* LAYOUT PRINCIPAL: 1/3 Datos de Cliente y 2/3 Historial de Ventas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* COLUMNA PRINCIPAL (HISTORIAL DE VENTAS) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* 3. HISTORIAL DE VENTAS (LISTA/TABLA) */}
                            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                                <h2 className="flex items-center gap-2 text-2xl font-extrabold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                                    <FcTimeline />
                                    <span>Historial de Compras Recientes</span>
                                </h2>

                                {/* Lista de Ventas (Diseño tipo Tarjeta/Fila para mejor UX) */}
                                <CustomerSaleList data={data}/>
                            </div>

                        </div>
                        {/* COLUMNA LATERAL (DATOS DEL CLIENTE) */}
                        <aside className="lg:col-span-1 space-y-6">

                            {/* 1. FICHA DE CONTACTO PRINCIPAL */}
                            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="text-blue-500 mr-2"><FcLink /></span> Contacto Principal
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
                                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4">
                                    <FcComboChart /> <span>Estadísticas</span>
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
    } catch (error) {
        return (
            <ProtectedRoute>
                <main className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50 p-4">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-100 border-2 border-gray-300 text-red-800 px-6 py-8 rounded-xl shadow-lg text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-xl font-bold mb-2">¡Oops! No pudimos encontrar la informacion del cliente</h2>
                        <p className="text-red-700">El perfil del usuario no existe en nuestra base de datos o no se pudo cargar en este momento.</p>
                        <div className="mt-6">
                            <Link href="/customers">
                                <Button color="red">
                                    🏠 Volver a la lista de clientes
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </ProtectedRoute>
        );
    }
}