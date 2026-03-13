export class RegisterEstablishmentDto{
    readonly name: string;
    constructor(name: string){
        this.name = name;
        Object.freeze(this); // Congela el objeto para hacerlo inmutable
    }
}