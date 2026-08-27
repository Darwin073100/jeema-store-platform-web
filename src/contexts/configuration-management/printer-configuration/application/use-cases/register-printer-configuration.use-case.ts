import { PrinterConfigurationEntity } from "../../domain/entities/printer-configuration.entity";
import { PrinterConfigurationRepository } from "../../domain/repositories/printer-configuration.repository";
import { PaperWidthVO } from "../../domain/value-objects/paper-width.vo";
import { PrinterConnectionTypeVO } from "../../domain/value-objects/printer-connection-type.vo";

/** Comando de entrada del caso de uso de registro. No hay archivo DTO dedicado en el plan del
 * módulo (ver "Archivos a crear" del spec) — se declara el contrato de entrada aquí mismo. */
export interface RegisterPrinterConfigurationCommand {
  readonly branchOfficeId: bigint;
  readonly label: string;
  readonly connectionType: string;
  readonly target: string;
  readonly paperWidthMm: number;
  readonly autoPrintOnSale: boolean;
  readonly openCashDrawer: boolean;
  readonly copies: number;
}

export class RegisterPrinterConfigurationUseCase {
  constructor(
    private readonly repository: PrinterConfigurationRepository,
  ) {}

  public async execute(command: RegisterPrinterConfigurationCommand): Promise<PrinterConfigurationEntity> {
    const connectionType = PrinterConnectionTypeVO.create(command.connectionType);
    const paperWidth = PaperWidthVO.create(command.paperWidthMm);

    const printerConfiguration = PrinterConfigurationEntity.create(
      command.branchOfficeId,
      command.label,
      connectionType,
      command.target,
      paperWidth,
      command.autoPrintOnSale,
      command.openCashDrawer,
      command.copies,
    );

    return this.repository.save(printerConfiguration);
  }
}
