export class UpdateSeasonDto {
  constructor(
    public readonly seasonId: bigint,
    public readonly name?: string,
    public readonly description?: string | null,
    public readonly dateInit?: Date | null,
    public readonly dateFinish?: Date | null,
  ) {}
}
