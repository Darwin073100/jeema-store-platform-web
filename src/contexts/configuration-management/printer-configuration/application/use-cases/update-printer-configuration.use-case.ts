import { PrinterConfigurationEntity } from "../../domain/entities/printer-configuration.entity";
import { PrinterConfigurationNotFoundException } from "../../domain/exceptions/printer-configuration-not-found.exception";
import { PrinterConfigurationRepository } from "../../domain/repositories/printer-configuration.repository";
import { PaperWidthVO } from "../../domain/value-objects/paper-width.vo";
import { PrinterConnectionTypeVO } from "../../domain/value-objects/printer-connection-type.vo";

/** Comando de entrada del caso de uso de actualización. No hay archivo DTO dedicado en el plan
 * del módulo (ver "Archivos a crear" del spec) — se declara el contrato de entrada aquí mismo. */
export interface UpdatePrinterConfigurationCommand {
  readonly printerConfigurationId: bigint;
  readonly label: string;
  readonly connectionType: string;
  readonly target: string;
  readonly paperWidthMm: number;
  readonly autoPrintOnSale: boolean;
  readonly openCashDrawer: boolean;
  readonly copies: number;
  readonly isActive: boolean;
}

export class UpdatePrinterConfigurationUseCase {
  constructor(
    private readonly repository: PrinterConfigurationRepository,
  ) {}

  public async execute(command: UpdatePrinterConfigurationCommand): Promise<PrinterConfigurationEntity> {
    const printerConfiguration = await this.repository.findById(command.printerConfigurationId);
    if (!printerConfiguration) {
      throw new PrinterConfigurationNotFoundException('Configuración de impresora no encontrada.');
    }

    const connectionType = PrinterConnectionTypeVO.create(command.connectionType);
    const paperWidth = PaperWidthVO.create(command.paperWidthMm);

    printerConfiguration.updateLabel(command.label);
    printerConfiguration.updateConnectionType(connectionType, command.target);
    printerConfiguration.updatePaperWidth(paperWidth);
    printerConfiguration.updateAutoPrintOnSale(command.autoPrintOnSale);
    printerConfiguration.updateOpenCashDrawer(command.openCashDrawer);
    printerConfiguration.updateCopies(command.copies);

    if (command.isActive) {
      printerConfiguration.activate();
    } else {
      printerConfiguration.deactivate();
    }

    return this.repository.update(printerConfiguration);
  }
}
