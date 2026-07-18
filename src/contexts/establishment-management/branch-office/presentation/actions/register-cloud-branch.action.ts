'use server'
import { TypeOrmEstablishmentRepository } from "@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository";
import { FetchCloudBranchOffice } from "../../infraestructure/persistence/typeorm/repositories/fetch-cloud-branch-office"
import { TypeOrmBranchOfficeRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { ICloudBranchOffice } from "../interfaces/ICloudBranchOffice";
import { revalidatePath } from "next/cache";
import { RegisterCloudBranchDto } from "../../application/dtos/register-cloud-branch.dto";
import { RegisterCloudBranchUseCase } from "../../application/use-cases/register-cloud-branch.use-case";

export async function registerCloudBranchOfficeAction(dto: RegisterCloudBranchDto): Promise<{
    ok: boolean;
    value?: ICloudBranchOffice;
    error?: ErrorEntity;
}> {
    try {
        const fetchCloudBranchRepository = FetchCloudBranchOffice.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const establishmentRepository = await TypeOrmEstablishmentRepository.create();
        const transactionDB = await TypeormTransactionDBRepository.create();

        const useCase = new RegisterCloudBranchUseCase(
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
            ...handleError(error, 'registerCloudBranchOfficeAction')
        }
    }
}