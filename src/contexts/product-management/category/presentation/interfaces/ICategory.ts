export interface ICategory {
    categoryId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    description: string|null;
}
