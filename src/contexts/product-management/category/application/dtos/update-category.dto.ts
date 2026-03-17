export interface UpdateCategoryDTO{
    readonly categoryId: bigint;
    readonly name?: string;
    readonly description?: string|null;
}