'use server'

import { TypeOrmEstablishmentRepository } from "@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository";
import { RegisterCloudBranchAndCloudEstablishmentUseCase } from "../../application/use-cases/register-cloud-branch-and-cloud-establishment.use-case";
import { FetchCloudBranchOffice } from "../../infraestructure/persistence/typeorm/repositories/fetch-cloud-branch-office"
import { TypeOrmBranchOfficeRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { RegisterBranchAndEstablishmentDto } from "../../application/dtos/register-branch-and-establishment.dto";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { ICloudBranchOffice } from "../interfaces/ICloudBranchOffice";
import { revalidatePath } from "next/cache";

export async function registerCloudBranchOfficeAndCloudEstablishmentAction(dto: RegisterBranchAndEstablishmentDto): Promise<{
    ok: boolean;
    value?: ICloudBranchOffice;
    error?: ErrorEntity;
}> {
    try {
        const fetchCloudBranchRepository = FetchCloudBranchOffice.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const establishmentRepository = await TypeOrmEstablishmentRepository.create();
        const transactionDB = await TypeormTransactionDBRepository.create();

        const useCase = new RegisterCloudBranchAndCloudEstablishmentUseCase(
            branchOfficeRepository,
            fetchCloudBranchRepository,
            establishmentRepository,
            transactionDB
        );

        const result = await useCase.execute(dto);

        if(result.ok){
            revalidatePath('transfers/configuration');
        }

        return {
            ...result
        }
    } catch (error) {
        return {
            ...handleError(error, 'registerCloudBranchOfficeAndCloudEstablishmentAction')
        }
    }
}