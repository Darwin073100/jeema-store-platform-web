import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidCloudTransferException } from "../exceptions/invalid-cloud-transfer.exception";

interface Prop {
    value: string | null;
}

/** Espeja el límite `errorMessage` (maxLength 1000) del schema `ErrorCloudTransferCommand` de EDYOF. */
export class CloudTransferErrorMessageVO extends ValueObject<Prop> {
    private constructor(value: string | null) {
        super({ value });
    }

    public static create(value: string | null): CloudTransferErrorMessageVO {
        if (value === null || value === undefined) {
            return new CloudTransferErrorMessageVO(null);
        }
        if (value.length > 1000) {
            throw new InvalidCloudTransferException('El mensaje de error no puede superar los 1000 caracteres.');
        }
        return new CloudTransferErrorMessageVO(value);
    }

    get value(): string | null {
        return this.props.value;
    }
}
