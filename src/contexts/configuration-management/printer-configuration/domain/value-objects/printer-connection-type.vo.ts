import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { InvalidPrinterConnectionException } from "../exceptions/invalid-printer-connection.exception";

/**
 * Mecanismo de transporte que usa QZ Tray para hablar con la impresora:
 * - QZ_OS_PRINTER: impresora ya instalada/compartida en el sistema operativo (se identifica por
 *   su nombre, obtenido con `qz.printers.find()`).
 * - QZ_NETWORK: socket raw directo a una impresora de red, target = "ip:puerto".
 * - QZ_USB: impresora conectada por USB, direccionada por QZ Tray (vendor/product o nombre).
 */
export enum PrinterConnectionTypeEnum {
    QZ_OS_PRINTER = 'QZ_OS_PRINTER',
    QZ_NETWORK = 'QZ_NETWORK',
    QZ_USB = 'QZ_USB',
}

interface PrinterConnectionTypeProps {
    value: PrinterConnectionTypeEnum;
}

export class PrinterConnectionTypeVO extends ValueObject<PrinterConnectionTypeProps> {
    private static readonly ALLOWED_VALUES: readonly PrinterConnectionTypeEnum[] = Object.values(PrinterConnectionTypeEnum);

    private constructor(props: PrinterConnectionTypeProps) {
        super(props);
    }

    /**
     * Crea una nueva instancia del Value Object PrinterConnectionType.
     *
     * @param value El tipo de conexión (debe ser uno de PrinterConnectionTypeEnum).
     * @returns Una nueva instancia de PrinterConnectionTypeVO.
     * @throws InvalidPrinterConnectionException si el valor no es uno de los tipos soportados.
     */
    public static create(value: string): PrinterConnectionTypeVO {
        if (!value || !PrinterConnectionTypeVO.ALLOWED_VALUES.includes(value as PrinterConnectionTypeEnum)) {
            throw new InvalidPrinterConnectionException(
                `Tipo de conexión de impresora inválido: "${value}". Valores permitidos: ${PrinterConnectionTypeVO.ALLOWED_VALUES.join(', ')}.`,
            );
        }
        return new PrinterConnectionTypeVO({ value: value as PrinterConnectionTypeEnum });
    }

    get value(): PrinterConnectionTypeEnum {
        return this.props.value;
    }

    get isNetwork(): boolean {
        return this.props.value === PrinterConnectionTypeEnum.QZ_NETWORK;
    }
}
