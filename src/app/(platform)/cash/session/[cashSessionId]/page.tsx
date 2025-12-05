import { findCashSessionWithTransactionsAction } from "@/features/cash/actions/find-cash-session-with-transactions.action";
import { CashIn } from "@/features/cash/presentation/ui/close/CashIn";
import { CashInfo } from "@/features/cash/presentation/ui/close/CashInfo";
import { CashCloseOptios } from "@/features/cash/presentation/ui/close/CashOptios";
import { CashOut } from "@/features/cash/presentation/ui/close/CashOut";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic";
import { Metadata } from "next";

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Perfil del cliente'
}

interface Props {
    params: {
        cashSessionId: string;
    }
}

export default async function SaleInformationPage({ params }: Props) {
    try {
        const { cashSessionId } = await params;
        const customer = await findCashSessionWithTransactionsAction(BigInt(cashSessionId));
        const data = customer?.value;

        const breadcrumbItems: BreadcrumbItem[] = [
            {
                label: 'cajas',
                href: '/cash'
            },
            {
                label: `${data?.cashRegister?.name ?? ''}`
            }
        ]

        if (!customer?.ok || !data) {
            return (
                <TemplateNotFoundDinamic
                    linkHref="/cash"/>
            );
        }
        return (
            <ProtectedRoute>
                <TemplateHeader title={`${data?.cashRegister?.name ?? ''}`} detail="Información del perfil del cliente." breadcrumbItems={breadcrumbItems}>
                    <CashCloseOptios 
                        cashSession={data}/>
                    <article className="grid grid-cols-3 max-md:grid-cols-1 max-sm:grid-cols-1 gap-4">
                        <CashInfo
                            cashSession={data}/>
                        <CashIn 
                            cashSession={data}/>
                        <CashOut
                            cashSession={data}/>
                    </article>
                </TemplateHeader>
            </ProtectedRoute>
        )
    } catch (error) {
        return (
           <TemplateNotFoundDinamic
                linkHref="/cash"/>
        );
    }
}