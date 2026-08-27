import { PrinterConfigurationEntity } from "../../domain/entities/printer-configuration.entity";
import { PrinterConnectionTypeView, IPrinterConfiguration, PaperWidthMmView } from "../../presentation/interfaces/IPrinterConfiguration";
import { PrinterConfigurationResponseDto } from "../dtos/printer-configuration-response.dto";

export class PrinterConfigurationMapper {
  /**
   * Convierte una entidad de dominio PrinterConfiguration a un DTO de respuesta.
   */
  public static toResponseDto(entity: PrinterConfigurationEntity): PrinterConfigurationResponseDto {
    return new PrinterConfigurationResponseDto(
      entity.printerConfigurationId.toString(),
      entity.branchOfficeId.toString(),
      entity.label,
      entity.connectionType.value,
      entity.target,
      entity.paperWidth.value,
      entity.autoPrintOnSale,
      entity.openCashDrawer,
      entity.copies,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toIResponse(entity: PrinterConfigurationEntity): IPrinterConfiguration {
    return {
      printerConfigurationId: entity.printerConfigurationId,
      branchOfficeId: entity.branchOfficeId,
      label: entity.label,
      connectionType: entity.connectionType.value as PrinterConnectionTypeView,
      target: entity.target,
      paperWidthMm: entity.paperWidth.value as PaperWidthMmView,
      autoPrintOnSale: entity.autoPrintOnSale,
      openCashDrawer: entity.openCashDrawer,
      copies: entity.copies,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
