export interface ICategory {
    categoryId: bigint;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    description: string|null;
}
