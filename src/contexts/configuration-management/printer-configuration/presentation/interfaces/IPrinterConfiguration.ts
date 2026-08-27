export type PrinterConnectionTypeView = 'QZ_OS_PRINTER' | 'QZ_NETWORK' | 'QZ_USB';
export type PaperWidthMmView = 58 | 80;

/** Vista cliente de una configuración de impresora (formas primitivas, serializable a JSON). */
export interface IPrinterConfiguration {
    printerConfigurationId: bigint;
    branchOfficeId: bigint;
    label: string;
    connectionType: PrinterConnectionTypeView;
    target: string;
    paperWidthMm: PaperWidthMmView;
    autoPrintOnSale: boolean;
    openCashDrawer: boolean;
    copies: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date | null;
}
