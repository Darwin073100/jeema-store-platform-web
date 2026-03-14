import { ValueObject } from "@/shared/domain/value-objects/value-object";
import { InvalidAddressException } from "../exceptions/invalid-address.exception";

interface Props {
    value: string;
}
export class AddressStateVO extends ValueObject<Props> {
    private constructor({ value }: Props) {
        super({ value });
    }

    public static create(value: string) {
      if (!value || value.trim() === '') {
        throw new InvalidAddressException('La ciudad no puede ir vacia.');
      }
      if (value.length > 100) {
        throw new InvalidAddressException('La ciudad no puede tener mas de 100 caracteres.');
      }
        return new AddressStateVO({value});
    }

    get value(){
        return this.props.value;
    }
}