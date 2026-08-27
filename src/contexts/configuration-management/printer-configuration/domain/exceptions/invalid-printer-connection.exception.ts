import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

/**
 * Cubre cualquier violación de invariante del agregado PrinterConfiguration: tipo de conexión
 * desconocido, target vacío o con formato incorrecto para el tipo de conexión elegido, ancho de
 * papel no soportado, etiqueta inválida o número de copias fuera de rango.
 */
export class InvalidPrinterConnectionException extends DomainException {
    constructor(message: string) {
        super(message, 400);
    }
}
