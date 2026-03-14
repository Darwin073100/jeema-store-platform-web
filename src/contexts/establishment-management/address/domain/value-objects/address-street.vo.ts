import { ValueObject } from "@/shared/domain/value-objects/value-object";
import { InvalidAddressException } from "../exceptions/invalid-address.exception";

interface Props {
    value: string | null;
}
export class AddressStreetVO extends ValueObject<Props> {
    private constructor({ value }: Props) {
        super({ value });
    }

    public static create(value: string | null) {
        if (value && value.length > 255) {
            throw new InvalidAddressException('La calle no puede tener mas de 255 caracteres.');
        }
        return new AddressStreetVO({value});
    }

    get value(){
        return this.props.value;
    }
}