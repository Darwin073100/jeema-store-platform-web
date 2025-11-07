'use server'
import { cookies } from "next/headers";
import { LocalTransferDTO } from "../application/dtos/local-transfer.dto";
import { LocalTransferUseCase } from "../application/use-cases/local-transfer.use-case";
import { TransferRepository } from "../domain/repositories/transfer.repository";
import { TransferRepositoryFactory } from "../infraestructure/factories/transfer-repository.factory";
import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";
import { EmployeeEntity } from "@/features/employee/domain/entities/employee.entity";
import { revalidatePath } from "next/cache";

export async function localTransferAction(command: Omit<LocalTransferDTO, 'requestedByEmployeeId' | 'branchOfficeId'>) {
    // Aquí se llamaría al repositorio que maneja los traspasos locales
    const transferRepository: TransferRepository = TransferRepositoryFactory.create();
    const useCase = new LocalTransferUseCase(transferRepository);

    const cookieStore = await cookies();
    
    let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
    let branchOfficeId = BigInt(0);
    if (branchOffice) {
        branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
    }
    
    let employee = cookieStore.get('employeeCookie')?.value ?? null;
    let employeeId = BigInt(0);
    if (employee) {
        employeeId = (JSON.parse(employee) as EmployeeEntity).employeeId;
    }

    const currentCommand: LocalTransferDTO = {
        ...command,
        requestedByEmployeeId: employeeId,
        branchOfficeId: branchOfficeId,
    };

    const result = await useCase.execute(currentCommand);

    if(result.ok){
        revalidatePath('/products');
    }

    return {
        ...result
    };
}