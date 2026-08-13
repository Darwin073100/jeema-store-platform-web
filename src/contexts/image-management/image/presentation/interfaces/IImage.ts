export interface IImage {
  imageId: bigint;
  ownerType: string;
  ownerId: bigint;
  url: string;
  mimeType: string;
  sizeBytes: number;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date | null;
}
