export interface RegisterSeasonDto {
    readonly establishmentId: bigint;
    readonly name: string;
    readonly description: string | null;
    readonly dateInit: Date | null;
    readonly dateFinish: Date | null;
}
