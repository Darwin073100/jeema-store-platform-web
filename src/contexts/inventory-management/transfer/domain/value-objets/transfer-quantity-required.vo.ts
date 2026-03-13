import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop{
    value: number;
}
export class TransferQuantityRequiredVO extends ValueObject< Prop >{
    private constructor(value: number){
        super({value});
    }

    public static create(value: number){      
        const format = Number(value)?.toFixed(3);
        if(Number(value) < 0){
            throw new Error('La cantidad transferida no puede ser menor a 0.');
        }
        return new TransferQuantityRequiredVO(Number(format));
    }

    get value(): number{
        return this.props.value;
    }
}