export class RegisterCategoryDto{
    readonly establishmentId: bigint;
    readonly name: string;
    readonly description: string|null;
    constructor(
        establishmentId: bigint,
        name: string,
        description: string|null
    ){
        this.establishmentId = establishmentId;
        this.name = name;
        this.description = description;
    }
}