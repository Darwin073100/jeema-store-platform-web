import { InvalidAddressException } from "../../exceptions/invalid-address.exception";
import { ValueObject } from "../value-object";
interface Props {
    value: string | null;
}
export class AddressNeighborhoodVO extends ValueObject<Props> {
    private constructor({ value }: Props) {
        super({ value });
    }

    public static create(value: string | null) {
        if (value && value.length > 100) {
            throw new InvalidAddressException('El barrio/colonia no puede tener mas de 100 caracteres.');
        }
        return new AddressNeighborhoodVO({value});
    }

    get value(){
        return this.props.value;
    }
}