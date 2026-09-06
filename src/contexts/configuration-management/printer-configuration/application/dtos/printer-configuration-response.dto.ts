export class PrinterConfigurationResponseDto {
  readonly printerConfigurationId: string;
  readonly cashRegisterId: string;
  readonly label: string;
  readonly connectionType: string;
  readonly target: string;
  readonly paperWidthMm: number;
  readonly autoPrintOnSale: boolean;
  readonly openCashDrawer: boolean;
  readonly copies: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;

  constructor(
    printerConfigurationId: string,
    cashRegisterId: string,
    label: string,
    connectionType: string,
    target: string,
    paperWidthMm: number,
    autoPrintOnSale: boolean,
    openCashDrawer: boolean,
    copies: number,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date | null,
  ) {
    this.printerConfigurationId = printerConfigurationId;
    this.cashRegisterId = cashRegisterId;
    this.label = label;
    this.connectionType = connectionType;
    this.target = target;
    this.paperWidthMm = paperWidthMm;
    this.autoPrintOnSale = autoPrintOnSale;
    this.openCashDrawer = openCashDrawer;
    this.copies = copies;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    Object.freeze(this);
  }
}
