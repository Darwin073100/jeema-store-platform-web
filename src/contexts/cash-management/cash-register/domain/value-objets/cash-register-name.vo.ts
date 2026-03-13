import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { CashRegisterInvalidException } from "../exceptions/cash-register-invalid.exception";

interface Props {
    value: string
}

export class CashRegisterNameVO extends ValueObject<Props> {
    private constructor(value: string){
        super({value});
    }

    public static create(value: string){
        if(value.trim().length <= 0){
            throw new CashRegisterInvalidException('El nombre de la caja no puede venir vacío.');
        }
        if(value.length < 3){
            throw new CashRegisterInvalidException('El nombre de la caja debe tener mas de 3 caracteres.');
        }
        if(value.length > 150){
            throw new CashRegisterInvalidException('El nombre de la caja debe tener menos de 150 caracteres.');
        }
        return new CashRegisterNameVO(value);
    }

    public get value(): string{
        return this.props.value;
    }
}