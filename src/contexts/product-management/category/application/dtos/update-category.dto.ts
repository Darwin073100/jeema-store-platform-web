export class UpdateCategoryDTO{
    readonly categoryId: bigint;
    readonly name?: string;
    readonly description?: string|null;
    constructor(
        categoryId: bigint,
        name?: string,
        description?: string|null
    ){
        this.categoryId = categoryId;   
        this.name = name;
        this.description = description;
    }
}