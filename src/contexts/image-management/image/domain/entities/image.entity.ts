import { ImageOwnerType } from '../enums/image-owner-type.enum';

/**
 * ImageEntity representa una imagen asociada de forma polimórfica a un
 * dueño (`ownerType` + `ownerId`): producto, empleado o establecimiento.
 *
 * Las reglas de colección (máximo 3 imágenes activas por dueño, sólo una
 * marcada como principal) NO viven aquí — viven en los use-cases, porque
 * son reglas que involucran a varias instancias de `ImageEntity` a la vez.
 * Esta entidad sólo conoce y protege su propio estado individual.
 */
export class ImageEntity {
  private readonly _imageId: bigint;
  private readonly _ownerType: ImageOwnerType;
  private readonly _ownerId: bigint;
  private readonly _storageKey: string;
  private _url: string;
  private readonly _mimeType: string;
  private readonly _sizeBytes: number;
  private _isPrimary: boolean;
  private _sortOrder: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;

  private constructor(
    imageId: bigint,
    ownerType: ImageOwnerType,
    ownerId: bigint,
    storageKey: string,
    url: string,
    mimeType: string,
    sizeBytes: number,
    isPrimary: boolean,
    sortOrder: number,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this._imageId = imageId;
    this._ownerType = ownerType;
    this._ownerId = ownerId;
    this._storageKey = storageKey;
    this._url = url;
    this._mimeType = mimeType;
    this._sizeBytes = sizeBytes;
    this._isPrimary = isPrimary;
    this._sortOrder = sortOrder;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
  }

  static create(
    ownerType: ImageOwnerType,
    ownerId: bigint,
    storageKey: string,
    url: string,
    mimeType: string,
    sizeBytes: number,
    isPrimary: boolean,
    sortOrder: number,
  ): ImageEntity {
    return new ImageEntity(
      BigInt(0),
      ownerType,
      ownerId,
      storageKey,
      url,
      mimeType,
      sizeBytes,
      isPrimary,
      sortOrder,
      new Date(),
      null,
      null,
    );
  }

  static reconstitute(
    imageId: bigint,
    ownerType: ImageOwnerType,
    ownerId: bigint,
    storageKey: string,
    url: string,
    mimeType: string,
    sizeBytes: number,
    isPrimary: boolean,
    sortOrder: number,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ): ImageEntity {
    return new ImageEntity(
      imageId,
      ownerType,
      ownerId,
      storageKey,
      url,
      mimeType,
      sizeBytes,
      isPrimary,
      sortOrder,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }

  // Getters
  get imageId(): bigint {
    return this._imageId;
  }
  get ownerType(): ImageOwnerType {
    return this._ownerType;
  }
  get ownerId(): bigint {
    return this._ownerId;
  }
  get storageKey(): string {
    return this._storageKey;
  }
  get url(): string {
    return this._url;
  }
  get mimeType(): string {
    return this._mimeType;
  }
  get sizeBytes(): number {
    return this._sizeBytes;
  }
  get isPrimary(): boolean {
    return this._isPrimary;
  }
  get sortOrder(): number {
    return this._sortOrder;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date | null {
    return this._updatedAt;
  }
  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  // Métodos de comportamiento del dominio
  public markAsPrimary(): void {
    if (this._isPrimary) return;
    this._isPrimary = true;
    this._updatedAt = new Date();
  }

  public unmarkAsPrimary(): void {
    if (!this._isPrimary) return;
    this._isPrimary = false;
    this._updatedAt = new Date();
  }

  public updateSortOrder(newSortOrder: number): void {
    if (this._sortOrder === newSortOrder) return;
    this._sortOrder = newSortOrder;
    this._updatedAt = new Date();
  }

  public softDelete(): void {
    if (this._deletedAt) return;
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  public restore(): void {
    if (!this._deletedAt) return;
    this._deletedAt = null;
    this._updatedAt = new Date();
  }
}
