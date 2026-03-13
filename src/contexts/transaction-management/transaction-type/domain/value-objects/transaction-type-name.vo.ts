import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { TransactionTypeInvalidException } from "../exceptions/transaction-type-invalid.exception";

interface Prop {
    value: string
}
export class TransactionTypeNameVO extends ValueObject<Prop> {
    private constructor(props: Prop){
        super(props);
    }

    public static create(value: string){
        if(value.trim().length === 0){
            throw new TransactionTypeInvalidException('El nombre del tipo de cuenta no puede venir vacio.');
        }

        return new TransactionTypeNameVO({ value });
    }

    get value(){
        return this.props.value;
    }
}