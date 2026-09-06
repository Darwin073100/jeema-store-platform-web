'use server';
import { unstable_noStore } from "next/cache";
import { TypeormPrinterConfigurationRepository } from "../../infraestructura/persistence/typeorm/repositories/typeorm-printer-configuration.repository";
import { FindPrinterConfigurationByCashRegisterUseCase } from "../../application/use-cases/find-printer-configuration-by-cash-register.use-case";
import { Result } from "@/shared/lib/utils/result";
import { PrinterConfigurationMapper } from "../../application/mappers/printer-configuration.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export async function findPrinterConfigurationByCashRegisterAction(cashRegisterId: bigint) {
    unstable_noStore();
    try {
        const repository = await TypeormPrinterConfigurationRepository.create();
        const useCase = new FindPrinterConfigurationByCashRegisterUseCase(repository);

        const result = await useCase.execute(cashRegisterId);

        return {
            ...Result.success({ printerConfiguration: result ? PrinterConfigurationMapper.toIResponse(result) : null }),
        };
    } catch (error) {
        return {
            ...handleError(error, 'findPrinterConfigurationByCashRegisterAction'),
        };
    }
}
