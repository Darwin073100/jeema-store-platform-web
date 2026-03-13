import { ValueObject } from "src/shared/domain/value-objects/value-object";

interface Prop{
    value: number | null;
}
export class TransferQuantityTransferredVO extends ValueObject< Prop >{
    private constructor(value: number | null){
        super({value});
    }

    public static create(value: number | null){
        if(!value){
            return new TransferQuantityTransferredVO(null);
        }
        
        const format = Number(value)?.toFixed(3);
        if(Number(value) < 0){
            throw new Error('La cantidad transferida no puede ser menor a 0.');
        }
        return new TransferQuantityTransferredVO(Number(format));
    }

    get value(): number | null{
        return this.props.value;
    }
}