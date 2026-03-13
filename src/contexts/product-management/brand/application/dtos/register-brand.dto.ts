export class RegisterBrandDto{
    readonly establishmentId: bigint;
    readonly name: string;

    constructor(establishmentId: bigint, name: string){
        this.establishmentId = establishmentId;
        this.name = name;
        Object.freeze(this); // Congela el objeto para hacerlo inmutable
    }
}