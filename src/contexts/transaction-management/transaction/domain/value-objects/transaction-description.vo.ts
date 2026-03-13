import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop {
    value: string | null
}

export class TransactionDescriptionVO extends ValueObject<Prop> {
    private constructor(props: Prop){
        super(props);
    }

    public static create(value: string | null){
        if(value && value.trim().length === 0){
            return new TransactionDescriptionVO({ value: null });
        }
        if(!value){
            return new TransactionDescriptionVO({ value: null });
        }

        return new TransactionDescriptionVO({ value });
    }

    get value(){
        return this.props.value;
    }
}