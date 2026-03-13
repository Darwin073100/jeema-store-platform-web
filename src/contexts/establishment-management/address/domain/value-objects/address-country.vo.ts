import { InvalidAddressException } from "../../exceptions/invalid-address.exception";
import { ValueObject } from "../value-object";
interface Props {
    value: string;
}
export class AddressCountryVO extends ValueObject<Props> {
    private constructor({ value }: Props) {
        super({ value });
    }

    public static create(value: string) {
      if (!value || value.trim() === '') {
        throw new InvalidAddressException('El país no puede ir vacio.');
      }
      if (value.length > 100) {
        throw new InvalidAddressException('El país no puede tener mas de 100 caracteres.');
      }
        return new AddressCountryVO({value});
    }

    get value(){
        return this.props.value;
    }
}