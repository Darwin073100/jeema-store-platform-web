import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { EstablishmentDetailTypeEnum } from "../enums/establishment-detail-type.enum";
import { InvalidEstablishmentDetailValueException } from "../exceptions/invalid-establishment-detail-value.exception";

interface EstablishmentDetailValueProps {
  value: string;
}

// Formato liviano, no estricto: dígitos, espacios, guiones y '+', 7 a 20 caracteres.
const PHONE_REGEX = /^[0-9+\-\s]{7,20}$/;
// Forma de correo suficientemente estricta sin ser una RFC 5322 completa.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FREE_TEXT_MAX_LENGTH = 250;
const SLOGAN_MAX_LENGTH = 150;

/**
 * EstablishmentDetailValueVO encapsula el `value` de un `EstablishmentDetail`.
 * Es un único Value Object genérico (no uno por tipo, para no multiplicar
 * clases): valida en `create(type, rawValue)` según el `type` recibido
 * mediante un switch interno, siguiendo el mismo estilo que `EstablishmentNameVO`.
 *
 * Reglas (validación liviana, no estricta):
 * - `EMAIL`: forma de correo válida.
 * - `PHONE_NUMBER` / `WHATSAPP`: sólo dígitos, espacios, guiones y '+', 7 a 20 caracteres.
 * - `WEBSITE` / `FACEBOOK` / `INSTAGRAM` / `TIKTOK`: URL completa o texto libre
 *   (ej. nombre de página), sólo se exige no vacío y máximo 250 caracteres.
 * - `SLOGAN`: no vacío, máximo 150 caracteres.
 */
export class EstablishmentDetailValueVO extends ValueObject<EstablishmentDetailValueProps> {
  private constructor(props: EstablishmentDetailValueProps) {
    super(props);
  }

  public static create(type: EstablishmentDetailTypeEnum, rawValue: string): EstablishmentDetailValueVO {
    const value = (rawValue ?? '').trim();

    switch (type) {
      case EstablishmentDetailTypeEnum.EMAIL:
        if (!EMAIL_REGEX.test(value)) {
          throw new InvalidEstablishmentDetailValueException('El correo electrónico no tiene un formato válido.');
        }
        break;

      case EstablishmentDetailTypeEnum.PHONE_NUMBER:
      case EstablishmentDetailTypeEnum.WHATSAPP:
        if (!PHONE_REGEX.test(value)) {
          throw new InvalidEstablishmentDetailValueException(
            'El número debe contener sólo dígitos, espacios, guiones o "+", entre 7 y 20 caracteres.',
          );
        }
        break;

      case EstablishmentDetailTypeEnum.WEBSITE:
      case EstablishmentDetailTypeEnum.FACEBOOK:
      case EstablishmentDetailTypeEnum.INSTAGRAM:
      case EstablishmentDetailTypeEnum.TIKTOK:
        if (value.length === 0) {
          throw new InvalidEstablishmentDetailValueException('El valor no puede estar vacío.');
        }
        if (value.length > FREE_TEXT_MAX_LENGTH) {
          throw new InvalidEstablishmentDetailValueException(`El valor no debe superar los ${FREE_TEXT_MAX_LENGTH} caracteres.`);
        }
        break;

      case EstablishmentDetailTypeEnum.SLOGAN:
        if (value.length === 0) {
          throw new InvalidEstablishmentDetailValueException('El slogan no puede estar vacío.');
        }
        if (value.length > SLOGAN_MAX_LENGTH) {
          throw new InvalidEstablishmentDetailValueException(`El slogan no debe superar los ${SLOGAN_MAX_LENGTH} caracteres.`);
        }
        break;

      default:
        throw new InvalidEstablishmentDetailValueException(`Tipo de dato de establecimiento desconocido: ${type}.`);
    }

    return new EstablishmentDetailValueVO({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
