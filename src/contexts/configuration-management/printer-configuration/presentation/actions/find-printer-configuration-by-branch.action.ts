'use server';
import { unstable_noStore } from "next/cache";
import { TypeormPrinterConfigurationRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-printer-configuration.repository";
import { FindPrinterConfigurationByBranchOfficeUseCase } from "../../application/use-cases/find-printer-configuration-by-branch-office.use-case";
import { Result } from "@/shared/lib/utils/result";
import { PrinterConfigurationMapper } from "../../application/mappers/printer-configuration.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function findPrinterConfigurationByBranchAction(branchOfficeId: bigint) {
    unstable_noStore();
    try {
        const repository = await TypeormPrinterConfigurationRepository.create();
        const useCase = new FindPrinterConfigurationByBranchOfficeUseCase(repository);

        const result = await useCase.execute(branchOfficeId);

        return {
            ...Result.success({ printerConfigurations: result.map(item => PrinterConfigurationMapper.toIResponse(item)) }),
        };
    } catch (error) {
        return {
            ...handleError(error, 'findPrinterConfigurationByBranchAction'),
        };
    }
}
