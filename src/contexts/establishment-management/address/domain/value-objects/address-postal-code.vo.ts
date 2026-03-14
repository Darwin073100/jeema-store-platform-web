import { ValueObject } from "@/shared/domain/value-objects/value-object";
import { InvalidAddressException } from "../exceptions/invalid-address.exception";

interface Props {
    value: string;
}
export class AddressPostalCodeVO extends ValueObject<Props> {
    private constructor({ value }: Props) {
        super({ value });
    }

    public static create(value: string) {
      if (!value || value.trim() === '') {
        throw new InvalidAddressException('El código postal no puede ir vacio.');
      }
      if (value.length > 10) { // Ejemplo de longitud para código postal
        throw new InvalidAddressException('El código postal no puede tener mas de 10 caracteres.');
      }
        return new AddressPostalCodeVO({value});
    }

    get value(){
        return this.props.value;
    }
}