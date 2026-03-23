import { findCashSessionWithTransactionsAction } from "@/features/cash/actions/find-cash-session-with-transactions.action";
import { CashInfo } from "@/features/cash/presentation/ui/close/CashInfo";
import { CashCloseOptios } from "@/features/cash/presentation/ui/close/CashOptios";
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
                    linkHref="/cash" />
            );
        }
        
        const headTable = ['Folio', 'Típo', 'Movimiento', 'Descripción', 'Monto', 'Hora', 'Cajero']
        return (
            <ProtectedRoute>
                <TemplateHeader title={`${data?.cashRegister?.name ?? ''}`} detail="Información del perfil del cliente." breadcrumbItems={breadcrumbItems}>
                    <CashCloseOptios
                        cashSession={data}
                        incomes={currentIncomeAcounts}
                        expenses={currentExpenseAcounts} />
                    <CashInfo
                        cashSession={data} />
                    <article>
                        <PrimaryTable theadList={headTable} isActions={false}>
                            {data.transactions.map(item => (
                                <PRow key={item.transactionId}>
                                    <PCol>{item.transactionId}</PCol>
                                    <PCol className={clsx(`font-bold ${item.transactionType?.accountType === AccountTypeEnum.INCOME? 'text-green-500':'text-red-500'}`)}>
                                        {item.transactionType?.accountType}
                                        </PCol>
                                    <PCol>{item.transactionType?.name}</PCol>
                                    <PCol>{item.description}</PCol>
                                    <PCol className={clsx(`font-bold ${item.transactionType?.accountType === AccountTypeEnum.INCOME? 'text-green-500':'text-red-500'}`)}>
                                        {item.transactionType?.accountType === AccountTypeEnum.INCOME?'+':'-'}
                                        {numberMoneyFormat(Number(item.amount ?? 0))}
                                    </PCol>
                                    <PCol>{formatTimeByDate(item.createdAt)}</PCol>
                                    <PCol>{`${data.employee?.firstName ?? 'N/A'}`}</PCol>
                                </PRow>
                            ))}
                        </PrimaryTable>
                    </article>
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