import { PrinterConfigurationEntity } from "../entities/printer-configuration.entity";

export const PRINTER_CONFIGURATION = Symbol('PRINTER_CONFIGURATION');

export interface PrinterConfigurationRepository {
    /**
     * Busca una configuración de impresora por su propio id (usado por el use-case de
     * actualización para cargar el agregado antes de mutarlo).
     */
    findById(printerConfigurationId: bigint): Promise<PrinterConfigurationEntity | null>;

    /**
     * Devuelve todas las configuraciones de impresora registradas para una sucursal (una sucursal
     * puede tener más de una impresora configurada, distinguidas por `label`).
     */
    findByBranchOffice(branchOfficeId: bigint): Promise<PrinterConfigurationEntity[]>;

    /** Inserta una nueva configuración de impresora. */
    save(entity: PrinterConfigurationEntity): Promise<PrinterConfigurationEntity>;

    /** Persiste cambios sobre una configuración de impresora ya existente. */
    update(entity: PrinterConfigurationEntity): Promise<PrinterConfigurationEntity>;
}
