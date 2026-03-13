export class RegisterPaymentMethodDto{
    readonly name: string;
    readonly requiresReference: boolean;
    constructor(
        name: string,
        requiresReference:boolean
    ){
        this.name = name;
        this.requiresReference = requiresReference;
    }
}