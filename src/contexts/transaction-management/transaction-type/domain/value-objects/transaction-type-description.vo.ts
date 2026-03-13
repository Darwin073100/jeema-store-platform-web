import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop {
    value: string | null
}
export class TransactionTypeDescriptionVO extends ValueObject<Prop> {
    private constructor(props: Prop){
        super(props);
    }

    public static create(value: string | null){
        if(value && value.trim().length === 0){
            return new TransactionTypeDescriptionVO({ value: null });
        }
        if(!value){
            return new TransactionTypeDescriptionVO({ value: null });
        }

        return new TransactionTypeDescriptionVO({ value });
    }

    get value(){
        return this.props.value;
    }
}