export class RegisterSeasonDto {
    public readonly establishmentId: bigint;
    public readonly name: string;
    public readonly description: string | null;
    public readonly dateInit: Date | null;
    public readonly dateFinish: Date | null;
}
