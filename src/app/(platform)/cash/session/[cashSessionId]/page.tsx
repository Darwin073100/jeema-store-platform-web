import { findCashSessionWithTransactionsAction } from "@/contexts/cash-management/cash-session/presentation/actions/find-cash-session-with-transactions.action";
import { getCashSessionSalesSummaryAction } from "@/contexts/cash-management/cash-session/presentation/actions/get-cash-session-sales-summary.action";
import { CashInfo } from "@/contexts/cash-management/cash-session/presentation/ui/close/CashInfo";
import { CashSalesSummary } from "@/contexts/cash-management/cash-session/presentation/ui/close/CashSalesSummary";
import { CashCloseOptios } from "@/contexts/cash-management/cash-session/presentation/ui/close/CashOptios";
import { findAllTransactionsTypeAction } from "@/contexts/transaction-management/transaction-type/presentation/actions/find-all-transactions-type.action";
import { formatDateShort, formatTimeByDate } from "@/shared/lib/utils/date-formatter";
import { numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { PCol, PrimaryTable, PRow } from "@/shared/ui/components/tables/PrimaryTable";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic";
import clsx from "clsx";
import { Metadata } from "next";
import { AccountTypeEnum } from "@/contexts/transaction-management/transaction-type/domain/enums/account-type.enum";
import { ICashSession } from "@/contexts/cash-management/cash-session/presentation/interfaces/ICashSession";
import { CashSessionTransactionsTable } from "@/contexts/cash-management/cash-session/presentation/ui/CashSessionTransactionsTable";

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
        const data = customer?.value as ICashSession | undefined;
        const resultExpenseAcounts = await findAllTransactionsTypeAction(AccountTypeEnum.EXPENSE);
        const currentExpenseAcounts = resultExpenseAcounts.value?.transactionsType ?? [];
        const resultIncomeAcounts = await findAllTransactionsTypeAction(AccountTypeEnum.INCOME);
        const currentIncomeAcounts = resultIncomeAcounts.value?.transactionsType ?? [];
        const salesSummary = await getCashSessionSalesSummaryAction(BigInt(cashSessionId));

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
                    linkHref="/cash" />
            );
        }
        
        return (
            <ProtectedRoute requiredRoles={['global_admin', 'establishment_manager', 'branch_office_management', 'cajero']}>
                <TemplateHeader title={`${data?.cashRegister?.name ?? ''}`} detail="Información del perfil del cliente." breadcrumbItems={breadcrumbItems}>
                    <CashCloseOptios
                        cashSession={data}
                        incomes={currentIncomeAcounts}
                        expenses={currentExpenseAcounts} />
                    <CashInfo
                        cashSession={data} />
                    <CashSalesSummary
                        summary={salesSummary} />
                    <CashSessionTransactionsTable 
                        data={data}/>
                </TemplateHeader>
            </ProtectedRoute>
        )
    } catch (error) {
        return (
            <TemplateNotFoundDinamic
                linkHref="/cash" />
        );
    }
}