/**
 * ImageResponseDto es el DTO de salida de los use-cases de `image-management`
 * hacia la capa de presentación. Deliberadamente NO incluye `storageKey`
 * (detalle interno de infraestructura, no debe llegar al cliente).
 */
export class ImageResponseDto {
  readonly imageId: string;
  readonly ownerType: string;
  readonly ownerId: string;
  readonly url: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;

  constructor(
    imageId: string,
    ownerType: string,
    ownerId: string,
    url: string,
    mimeType: string,
    sizeBytes: number,
    isPrimary: boolean,
    sortOrder: number,
    createdAt: Date,
    updatedAt: Date | null,
  ) {
    this.imageId = imageId;
    this.ownerType = ownerType;
    this.ownerId = ownerId;
    this.url = url;
    this.mimeType = mimeType;
    this.sizeBytes = sizeBytes;
    this.isPrimary = isPrimary;
    this.sortOrder = sortOrder;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    Object.freeze(this);
  }
}
