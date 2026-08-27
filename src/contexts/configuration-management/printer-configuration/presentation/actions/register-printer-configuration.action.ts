'use server';
import { unstable_noStore } from "next/cache";
import { TypeormPrinterConfigurationRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-printer-configuration.repository";
import { RegisterPrinterConfigurationCommand, RegisterPrinterConfigurationUseCase } from "../../application/use-cases/register-printer-configuration.use-case";
import { Result } from "@/shared/lib/utils/result";
import { PrinterConfigurationMapper } from "../../application/mappers/printer-configuration.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function registerPrinterConfigurationAction(command: RegisterPrinterConfigurationCommand) {
    unstable_noStore();
    try {
        const repository = await TypeormPrinterConfigurationRepository.create();
        const useCase = new RegisterPrinterConfigurationUseCase(repository);

        const result = await useCase.execute(command);

        return {
            ...Result.success(PrinterConfigurationMapper.toIResponse(result)),
        };
    } catch (error) {
        return {
            ...handleError(error, 'registerPrinterConfigurationAction'),
        };
    }
}
