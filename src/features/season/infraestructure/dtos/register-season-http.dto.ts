export interface RegisterSeasonHttpDTO{
    establishmentId: string;
    name: string,
    description?: string | null,
    dateInit?: string |null,
    dateFinish?: string |null,
}