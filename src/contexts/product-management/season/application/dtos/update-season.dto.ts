export interface UpdateSeasonDto {
  readonly seasonId: bigint,
  readonly name?: string,
  readonly description?: string | null,
  readonly dateInit?: Date | null,
  readonly dateFinish?: Date | null,
}
