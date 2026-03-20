'use server'

import { TypeOrmEstablishmentRepository } from "@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository";
import { RegisterBranchOfficeUseCase } from "../../application/use-cases/register-branch-office.use-case";
import { TypeOrmBranchOfficeRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { RegisterBranchOfficeDto } from "../../application/dtos/register-branch-office.dto";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/features/result";
import { BranchOfficeMapper } from "../../application/mappers/branch-office.mapper";

export async function createNewBranchOfficeAction(data: RegisterBranchOfficeDto) {
    try {
        const branchOfficeFetchRepositoryImpl = await TypeOrmBranchOfficeRepository.create();
        const establishmentRepository = await TypeOrmEstablishmentRepository.create();
        let createNewBranchOfficeUseCase = new RegisterBranchOfficeUseCase(branchOfficeFetchRepositoryImpl, establishmentRepository);

        const result = await createNewBranchOfficeUseCase.execute(data);

        return {
            ...Result.success(BranchOfficeMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('createNewBranchOfficeAction: ', error);
        return {
            ...handleError(error, 'createNewBranchOfficeAction')
        }
    }
}