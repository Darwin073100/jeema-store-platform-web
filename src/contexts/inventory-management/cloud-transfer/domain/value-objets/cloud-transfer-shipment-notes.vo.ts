import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCloudTransferException } from "../exceptions/invalid-cloud-transfer.exception";

interface Prop {
    value: string | null;
}

/** Espeja el límite `shipmentNotes` (maxLength 500) del schema `CreateCloudTransferCommand` de EDYOF. */
export class CloudTransferShipmentNotesVO extends ValueObject<Prop> {
    private constructor(value: string | null) {
        super({ value });
    }

    public static create(value: string | null): CloudTransferShipmentNotesVO {
        if (value === null || value === undefined) {
            return new CloudTransferShipmentNotesVO(null);
        }
        if (value.length > 500) {
            throw new InvalidCloudTransferException('Las notas de envío no pueden superar los 500 caracteres.');
        }
        return new CloudTransferShipmentNotesVO(value);
    }

    get value(): string | null {
        return this.props.value;
    }
}
