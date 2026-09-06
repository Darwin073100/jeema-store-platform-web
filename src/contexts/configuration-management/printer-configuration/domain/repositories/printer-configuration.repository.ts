import { PrinterConfigurationEntity } from "../entities/printer-configuration.entity";

export const PRINTER_CONFIGURATION = Symbol('PRINTER_CONFIGURATION');

export interface PrinterConfigurationRepository {
    /**
     * Busca una configuración de impresora por su propio id (usado por el use-case de
     * actualización para cargar el agregado antes de mutarlo).
     */
    findById(printerConfigurationId: bigint): Promise<PrinterConfigurationEntity | null>;

    /**
     * Devuelve la configuración de impresora registrada para una caja registradora (relación 1:1
     * — cada caja tiene a lo sumo una impresora configurada).
     */
    findByCashRegister(cashRegisterId: bigint): Promise<PrinterConfigurationEntity | null>;

    /** Inserta una nueva configuración de impresora. */
    save(entity: PrinterConfigurationEntity): Promise<PrinterConfigurationEntity>;

    /** Persiste cambios sobre una configuración de impresora ya existente. */
    update(entity: PrinterConfigurationEntity): Promise<PrinterConfigurationEntity>;
}
