import { InvalidPrinterConnectionException } from "../exceptions/invalid-printer-connection.exception";
import { PaperWidthVO } from "../value-objects/paper-width.vo";
import { PrinterConnectionTypeEnum, PrinterConnectionTypeVO } from "../value-objects/printer-connection-type.vo";

const LABEL_MAX_LENGTH = 100;
const TARGET_MAX_LENGTH = 250;
const MIN_COPIES = 1;
const MAX_COPIES = 10;
// host:puerto — acepta hostnames, IPv4 e IPv6 entre corchetes.
const NETWORK_TARGET_REGEX = /^[^\s:]+:\d{1,5}$|^\[[^\s\]]+\]:\d{1,5}$/;

export class PrinterConfigurationEntity {
  private readonly _printerConfigurationId: bigint;
  private readonly _branchOfficeId: bigint;
  private _label: string;
  private _connectionType: PrinterConnectionTypeVO;
  private _target: string;
  private _paperWidth: PaperWidthVO;
  private _autoPrintOnSale: boolean;
  private _openCashDrawer: boolean;
  private _copies: number;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date | null;

  private constructor(
    printerConfigurationId: bigint,
    branchOfficeId: bigint,
    label: string,
    connectionType: PrinterConnectionTypeVO,
    target: string,
    paperWidth: PaperWidthVO,
    autoPrintOnSale: boolean,
    openCashDrawer: boolean,
    copies: number,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date | null,
  ) {
    this._printerConfigurationId = printerConfigurationId;
    this._branchOfficeId = branchOfficeId;
    this._label = label;
    this._connectionType = connectionType;
    this._target = target;
    this._paperWidth = paperWidth;
    this._autoPrintOnSale = autoPrintOnSale;
    this._openCashDrawer = openCashDrawer;
    this._copies = copies;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Crea una nueva PrinterConfiguration para una sucursal. Nace activa.
   */
  static create(
    branchOfficeId: bigint,
    label: string,
    connectionType: PrinterConnectionTypeVO,
    target: string,
    paperWidth: PaperWidthVO,
    autoPrintOnSale: boolean,
    openCashDrawer: boolean,
    copies: number,
  ): PrinterConfigurationEntity {
    const validLabel = PrinterConfigurationEntity.assertValidLabel(label);
    const validTarget = PrinterConfigurationEntity.assertValidTarget(target, connectionType);
    const validCopies = PrinterConfigurationEntity.assertValidCopies(copies);

    return new PrinterConfigurationEntity(
      BigInt(new Date().getTime()),
      branchOfficeId,
      validLabel,
      connectionType,
      validTarget,
      paperWidth,
      autoPrintOnSale,
      openCashDrawer,
      validCopies,
      true,
      new Date(),
      null,
    );
  }

  static reconstitute(
    printerConfigurationId: bigint,
    branchOfficeId: bigint,
    label: string,
    connectionType: PrinterConnectionTypeVO,
    target: string,
    paperWidth: PaperWidthVO,
    autoPrintOnSale: boolean,
    openCashDrawer: boolean,
    copies: number,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date | null,
  ): PrinterConfigurationEntity {
    return new PrinterConfigurationEntity(
      printerConfigurationId,
      branchOfficeId,
      label,
      connectionType,
      target,
      paperWidth,
      autoPrintOnSale,
      openCashDrawer,
      copies,
      isActive,
      createdAt,
      updatedAt,
    );
  }

  // Getters
  get printerConfigurationId(): bigint {
    return this._printerConfigurationId;
  }

  get branchOfficeId(): bigint {
    return this._branchOfficeId;
  }

  get label(): string {
    return this._label;
  }

  get connectionType(): PrinterConnectionTypeVO {
    return this._connectionType;
  }

  get target(): string {
    return this._target;
  }

  get paperWidth(): PaperWidthVO {
    return this._paperWidth;
  }

  get autoPrintOnSale(): boolean {
    return this._autoPrintOnSale;
  }

  get openCashDrawer(): boolean {
    return this._openCashDrawer;
  }

  get copies(): number {
    return this._copies;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  // Métodos de comportamiento del dominio
  public activate(): void {
    if (this._isActive) {
      return; // No hay cambio, no se hace nada
    }
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    if (!this._isActive) {
      return; // No hay cambio, no se hace nada
    }
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public updateTarget(newTarget: string): void {
    const validTarget = PrinterConfigurationEntity.assertValidTarget(newTarget, this._connectionType);
    if (this._target === validTarget) {
      return;
    }
    this._target = validTarget;
    this._updatedAt = new Date();
  }

  public updateConnectionType(newConnectionType: PrinterConnectionTypeVO, newTarget: string): void {
    // El target depende del tipo de conexión (nombre de impresora vs ip:puerto), así que ambos
    // se revalidan y actualizan juntos para no dejar el agregado en un estado inconsistente.
    const validTarget = PrinterConfigurationEntity.assertValidTarget(newTarget, newConnectionType);
    this._connectionType = newConnectionType;
    this._target = validTarget;
    this._updatedAt = new Date();
  }

  public updateLabel(newLabel: string): void {
    const validLabel = PrinterConfigurationEntity.assertValidLabel(newLabel);
    if (this._label === validLabel) {
      return;
    }
    this._label = validLabel;
    this._updatedAt = new Date();
  }

  public updatePaperWidth(newPaperWidth: PaperWidthVO): void {
    if (this._paperWidth.equals(newPaperWidth)) {
      return;
    }
    this._paperWidth = newPaperWidth;
    this._updatedAt = new Date();
  }

  public updateAutoPrintOnSale(value: boolean): void {
    if (this._autoPrintOnSale === value) {
      return;
    }
    this._autoPrintOnSale = value;
    this._updatedAt = new Date();
  }

  public updateOpenCashDrawer(value: boolean): void {
    if (this._openCashDrawer === value) {
      return;
    }
    this._openCashDrawer = value;
    this._updatedAt = new Date();
  }

  public updateCopies(value: number): void {
    const validCopies = PrinterConfigurationEntity.assertValidCopies(value);
    if (this._copies === validCopies) {
      return;
    }
    this._copies = validCopies;
    this._updatedAt = new Date();
  }

  private static assertValidLabel(label: string): string {
    const trimmed = (label ?? '').trim();
    if (trimmed.length === 0) {
      throw new InvalidPrinterConnectionException('La etiqueta de la impresora no puede ir vacía.');
    }
    if (trimmed.length > LABEL_MAX_LENGTH) {
      throw new InvalidPrinterConnectionException(`La etiqueta de la impresora no puede tener más de ${LABEL_MAX_LENGTH} caracteres.`);
    }
    return trimmed;
  }

  private static assertValidTarget(target: string, connectionType: PrinterConnectionTypeVO): string {
    const trimmed = (target ?? '').trim();
    if (trimmed.length === 0) {
      throw new InvalidPrinterConnectionException('El destino (target) de la impresora no puede ir vacío.');
    }
    if (trimmed.length > TARGET_MAX_LENGTH) {
      throw new InvalidPrinterConnectionException(`El destino de la impresora no puede tener más de ${TARGET_MAX_LENGTH} caracteres.`);
    }
    if (connectionType.value === PrinterConnectionTypeEnum.QZ_NETWORK && !NETWORK_TARGET_REGEX.test(trimmed)) {
      throw new InvalidPrinterConnectionException(
        `El destino "${trimmed}" no es válido para una conexión de red: se espera el formato "ip:puerto".`,
      );
    }
    return trimmed;
  }

  private static assertValidCopies(copies: number): number {
    if (!Number.isInteger(copies) || copies < MIN_COPIES || copies > MAX_COPIES) {
      throw new InvalidPrinterConnectionException(`El número de copias debe ser un entero entre ${MIN_COPIES} y ${MAX_COPIES}.`);
    }
    return copies;
  }
}
