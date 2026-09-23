import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCloudTransferException } from "../exceptions/invalid-cloud-transfer.exception";

interface Prop {
    value: number;
}

/** Espeja `TransferQuantityRequiredVO` (transfer/ local): cantidad transferida, siempre > 0. */
export class CloudTransferItemQuantityVO extends ValueObject<Prop> {
    private constructor(value: number) {
        super({ value });
    }

    public static create(value: number): CloudTransferItemQuantityVO {
        const numeric = Number(value);
        if (Number.isNaN(numeric) || numeric <= 0) {
            throw new InvalidCloudTransferException('La cantidad transferida debe ser mayor a 0.');
        }
        const formatted = Number(numeric.toFixed(3));
        return new CloudTransferItemQuantityVO(formatted);
    }

    get value(): number {
        return this.props.value;
    }
}
