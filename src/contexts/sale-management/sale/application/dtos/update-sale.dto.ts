export class UpdatePaymentMethodDTO{
    readonly paymentMethodId: bigint;
    readonly name: string;
    readonly requiresReference: boolean;
    constructor(
        paymentMethodId: bigint,
        name: string,
        requiresReference: boolean
    ){
        this.paymentMethodId = paymentMethodId;   
        this.name = name;
        this.requiresReference = requiresReference;
    }
}