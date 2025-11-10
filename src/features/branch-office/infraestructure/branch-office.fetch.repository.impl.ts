import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { BranchOfficeEntity } from "../domain/entities/branch-office.entity";
import { BranchOfficeRepository } from "../domain/repositories/branch-office.repository";
import { CreateBranchOfficeDTO } from "../application/dtos/create-branch-office.dto";

export class BranchOfficeFetchRepositoryImpl implements BranchOfficeRepository{
    private readonly URL = `${process.env.URL_EDYOF_PLATFORM_API}${process.env.PREFIX_EDYOF_PLATFORM_API}/branch-offices`;
    
    async save(data: CreateBranchOfficeDTO): Promise<Result<BranchOfficeEntity, ErrorEntity>> {
        let dataBody = {
            name: data.name,
            establishmentId: data.establishmentId.toString(),
            street: data.street && (data.street.trim().length > 0) ? data.street: undefined,
            country: data.country,
            internalNumber: data.internalNumber && (data.internalNumber.trim().length > 0) ? data.internalNumber: undefined,
            externalNumber: data.externalNumber && (data.externalNumber.trim().length > 0) ? data.externalNumber: undefined,
            postalCode: data.postalCode,
            neighborhood: data.neighborhood && (data.neighborhood.trim().length > 0) ? data.neighborhood: undefined,
            municipality: data.municipality,
            city: data.city,
            state: data.state,
            reference: data.reference && (data.reference.trim().length > 0) ? data.reference: undefined
        }
    

        try {
            const response = await fetch(`${this.URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataBody),
            });

            if (!response.ok) {
                const error = await response.json() as ErrorEntity;
                return Result.failure(error);
            }

            const branchOffice = await response.json() as BranchOfficeEntity;
            return Result.success(branchOffice);

        } catch (error: any) {
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al servidor',
                statusCode: 500,
                path: `${process.env.PREFIX_EDYOF_PLATFORM_API}/branch-offices`,
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }

}