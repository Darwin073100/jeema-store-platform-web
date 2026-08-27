import { PrinterConfigurationEntity } from "../../domain/entities/printer-configuration.entity";
import { PrinterConfigurationRepository } from "../../domain/repositories/printer-configuration.repository";

export class FindPrinterConfigurationByBranchOfficeUseCase {
  constructor(
    private readonly repository: PrinterConfigurationRepository,
  ) {}

  public async execute(branchOfficeId: bigint): Promise<PrinterConfigurationEntity[]> {
    return this.repository.findByBranchOffice(branchOfficeId);
  }
}
