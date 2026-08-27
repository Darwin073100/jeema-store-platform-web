import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidPrinterConnectionException } from "../exceptions/invalid-printer-connection.exception";

/** Anchos de papel térmico soportados, en milímetros. */
export type PaperWidthMm = 58 | 80;

interface PaperWidthProps {
    value: PaperWidthMm;
}

export class PaperWidthVO extends ValueObject<PaperWidthProps> {
    private static readonly ALLOWED_VALUES: readonly PaperWidthMm[] = [58, 80];

    private constructor(props: PaperWidthProps) {
        super(props);
    }

    /**
     * Crea una nueva instancia del Value Object PaperWidth.
     *
     * @param value El ancho de papel en milímetros. Solo se aceptan 58 u 80.
     * @returns Una nueva instancia de PaperWidthVO.
     * @throws InvalidPrinterConnectionException si el valor no es 58 ni 80.
     */
    public static create(value: number): PaperWidthVO {
        if (!PaperWidthVO.ALLOWED_VALUES.includes(value as PaperWidthMm)) {
            throw new InvalidPrinterConnectionException(
                `Ancho de papel inválido: ${value}mm. Valores permitidos: ${PaperWidthVO.ALLOWED_VALUES.join(' o ')}.`,
            );
        }
        return new PaperWidthVO({ value: value as PaperWidthMm });
    }

    get value(): PaperWidthMm {
        return this.props.value;
    }
}
