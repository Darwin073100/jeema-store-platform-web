import { PrinterConfigurationEntity } from "../../domain/entities/printer-configuration.entity";
import { PrinterConfigurationRepository } from "../../domain/repositories/printer-configuration.repository";

export class FindPrinterConfigurationByCashRegisterUseCase {
  constructor(
    private readonly repository: PrinterConfigurationRepository,
  ) {}

  public async execute(cashRegisterId: bigint): Promise<PrinterConfigurationEntity | null> {
    return this.repository.findByCashRegister(cashRegisterId);
  }
}
