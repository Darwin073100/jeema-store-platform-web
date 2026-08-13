import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';

export class UploadImageDto {
  constructor(
    readonly ownerType: ImageOwnerType,
    readonly ownerId: bigint,
    readonly buffer: Buffer,
    readonly originalFileName: string,
    readonly declaredMimeType: string,
    readonly sizeBytes: number,
  ) {}
}
