export class SeasonResponseDto {
  seasonId: bigint;
  name: string;
  description?: string | null;
  dateInit?: Date | null;
  dateFinish?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
