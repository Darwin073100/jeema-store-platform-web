'use server'
import { cookies } from "next/headers";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeOrmEstablishmentRepository } from "@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository";
import { FetchCloudBranchOffice } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/fetch-cloud-branch-office";
import { ListCloudBranchOfficesForTransferUseCase } from "../../application/use-cases/list-cloud-branch-offices-for-transfer.use-case";
import { ICloudBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/ICloudBranchOffice";
import { IBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function listCloudBranchOfficesForTransferAction(): Promise<{ ok: boolean; value?: ICloudBranchOffice[]; error?: ErrorEntity }> {
    try {
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const establishmentRepository = await TypeOrmEstablishmentRepository.create();
        const cloudBranchOfficeRepository = FetchCloudBranchOffice.create();

        const useCase = new ListCloudBranchOfficesForTransferUseCase(
            branchOfficeRepository, establishmentRepository, cloudBranchOfficeRepository,
        );

        const cookieStore = await cookies();
        const branchOfficeCookie = cookieStore.get('branchOfficeCookie')?.value ?? null;
        const branchOfficeId = branchOfficeCookie ? (JSON.parse(branchOfficeCookie) as IBranchOffice).branchOfficeId : BigInt(0);

        const result = await useCase.execute(branchOfficeId);

        return { ...result };
    } catch (error) {
        console.error('listCloudBranchOfficesForTransferAction: ', error);
        return {
            ...handleError(error, 'listCloudBranchOfficesForTransferAction'),
        };
    }
}
