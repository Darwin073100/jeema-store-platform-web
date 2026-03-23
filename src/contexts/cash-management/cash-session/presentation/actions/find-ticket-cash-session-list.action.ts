'use server'
import { unstable_noStore as noStore } from 'next/cache';
import { CashFetchRepositoryFactory } from '../../../../../features/cash/infraestructure/factories/cash-fetch-repository.factory';
import { FindTicketCashSessionListUseCase } from '../../../../../features/cash/application/use-cases/find-ticket-cash-session-list.use-case';
import { cookies } from 'next/headers';
import { BranchOfficeEntity } from '@/features/branch-office/domain/entities/branch-office.entity';

export async function findTicketCashSessionListAction(dateInit: Date | null, dateFinish: Date | null) {
    noStore(); // Evitar que se cachée este server action

    try {
        // Inyeccion de las dependencias usando Factory
        const repository = CashFetchRepositoryFactory.create();
        const useCase = new FindTicketCashSessionListUseCase(repository);

        const cookieStore = await cookies();

        let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
        let branchOfficeId = BigInt(0);
        if (branchOffice) {
            branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
        }

        const result = await useCase.execute(branchOfficeId, {
            dateInit,
            dateFinish
        });

        return {
            ...result
        }
    } catch (error) {
        throw error;
    }
}