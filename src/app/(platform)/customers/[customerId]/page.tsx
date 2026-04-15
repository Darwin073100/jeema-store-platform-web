import { findOneCustomerByEstablishmentAction } from "@/contexts/sale-management/customer/presentation/actions/find-one-customer-by-establishment.action";
import { CustomerAddressCard } from "@/contexts/sale-management/customer/presentation/ui/details/CustomerAddressCard";
import { CustomerInformation } from "@/contexts/sale-management/customer/presentation/ui/details/CustomerInformation";
import { CustomerSaleList } from "@/contexts/sale-management/customer/presentation/ui/details/CustomerSaleList";
import { Button } from "@/shared/ui/components/buttons";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic";
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
            throw new Error();
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
                    <CustomerInformation 
                        customer={data}/>

                    </div>
                </TemplateHeader>
            </ProtectedRoute>
        )
    } catch (error) {
        return (
            <ProtectedRoute>
                <TemplateNotFoundDinamic
                    linkHref="/customers/"
                    linkText="Volver a la lista de clientes."
                    title="¡Oops! No pudimos encontrar este cliente"
                    description="El cliente solicitado no existe en nuestra base de datos o no se pudo cargar en este momento." />
            </ProtectedRoute>
        );
    }
}