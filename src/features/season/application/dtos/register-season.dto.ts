export interface RegisterSeasonDTO{
    establishmentId: bigint;
    name: string,
    description?: string | null,
    dateInit?: Date |null,
    dateFinish?: Date |null,
}