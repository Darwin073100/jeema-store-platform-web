import { findCashSessionWithTransactionsAction } from "@/features/cash/actions/find-cash-session-with-transactions.action";
import { CashIn } from "@/features/cash/presentation/ui/close/CashIn";
import { CashInfo } from "@/features/cash/presentation/ui/close/CashInfo";
import { CashCloseOptios } from "@/features/cash/presentation/ui/close/CashOptios";
import { CashOut } from "@/features/cash/presentation/ui/close/CashOut";
import { findAllTransactionsTypeAction } from "@/features/transaction/actions/find-all-transactions-type.action";
import { AccountTypeEnum } from "@/features/transaction/domain/enums/account-type.enum";
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
        const resultExpenseAcounts = await findAllTransactionsTypeAction(AccountTypeEnum.EXPENSE);
        const currentExpenseAcounts = resultExpenseAcounts.value?.transactionsType ?? [];
        const resultIncomeAcounts = await findAllTransactionsTypeAction(AccountTypeEnum.INCOME);
        const currentIncomeAcounts = resultIncomeAcounts.value?.transactionsType ?? [];

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
                        cashSession={data}
                        incomes={currentIncomeAcounts}
                        expenses={currentExpenseAcounts}/>
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