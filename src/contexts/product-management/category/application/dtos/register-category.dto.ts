export interface RegisterCategoryDto{
    readonly establishmentId: bigint;
    readonly name: string;
    readonly description: string|null;
}