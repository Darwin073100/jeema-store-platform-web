'use server'
import { cookies } from "next/headers";
import { TypeormCloudTransferRepository } from "../../infraestructure/repositories/typeorm-cloud-transfer.repository";
import { FetchCloudTransferRepository } from "../../infraestructure/http/repositories/fetch-cloud-transfer.repository";
import { TypeOrmBranchOfficeRepository } from "@/contexts/establishment-management/branch-office/infraestructure/persistence/typeorm/repositories/typeorm-branch-office.repository";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { ReceiveCloudTransferUseCase } from "../../application/use-cases/receive-cloud-transfer.use-case";
import { CloudTransferMapper } from "../../application/mappers/cloud-transfer.mapper";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { IEmployee } from "@/contexts/employee-management/employee/presentation/interfaces/IEmployee";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export async function receiveCloudTransferAction(
    cloudTransferId: bigint,
    notes?: string,
): Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }> {
    try {
        const cloudTransferRepository = await TypeormCloudTransferRepository.create();
        const cloudTransferApiRepository = FetchCloudTransferRepository.create();
        const branchOfficeRepository = await TypeOrmBranchOfficeRepository.create();
        const employeeRepository = await TypeOrmEmployeeRepository.create();
        const useCase = new ReceiveCloudTransferUseCase(cloudTransferRepository, cloudTransferApiRepository, branchOfficeRepository, employeeRepository);

        const cookieStore = await cookies();
        const employeeCookie = cookieStore.get('employeeCookie')?.value ?? null;
        const employeeId = employeeCookie ? (JSON.parse(employeeCookie) as IEmployee).employeeId : BigInt(0);

        const result = await useCase.execute(cloudTransferId, employeeId, notes ?? null);
        if (!result.ok) {
            return { ok: false, error: result.error };
        }

        return { ok: true, value: CloudTransferMapper.toIResponse(result.value!) };
    } catch (error) {
        console.error('receiveCloudTransferAction: ', error);
        return {
            ...handleError(error, 'receiveCloudTransferAction'),
        };
    }
}
