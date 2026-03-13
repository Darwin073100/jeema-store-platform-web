import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { TransactionInvalidException } from "../exceptions/transaction-invalid.exception";

interface Prop {
    value: number;
}
export class TransactionAmountVO extends ValueObject<Prop>{
    private constructor(props: Prop){
        super(props);
    }

    public static create(value: number){
        if(value < 0){
            throw new TransactionInvalidException('El monto de la transacción no puede ser negativo.');
        }
        return new TransactionAmountVO({ value });
    }

    get value(){
        return this.props.value;
    }
}