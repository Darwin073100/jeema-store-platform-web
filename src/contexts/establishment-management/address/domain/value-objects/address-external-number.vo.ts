import { InvalidAddressException } from "../../exceptions/invalid-address.exception";
import { ValueObject } from "../value-object";
interface Props {
    value: string | null;
}
export class AddressExternalNumberVO extends ValueObject<Props> {
    private constructor({ value }: Props) {
        super({ value });
    }

    public static create(value: string | null) {
        if (value && value.length > 20) {
        throw new InvalidAddressException('El número interior no puede tener mas de 20 caracteres.');
      }
        return new AddressExternalNumberVO({value});
    }

    get value(){
        return this.props.value;
    }
}