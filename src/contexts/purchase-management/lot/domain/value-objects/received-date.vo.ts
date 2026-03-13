import { ValueObject } from "src/shared/domain/value-objects/value-object";
import { LotValidateException } from "../exceptions/lot-validate.exception";

function parseFlexibleDate(input: string | Date): Date {
  if (input instanceof Date) {
    if (isNaN(input.getTime())) throw new LotValidateException('La fecha es inválida.');
    return input;
  }
  if (typeof input !== 'string') throw new LotValidateException('La fecha debe ser string o Date.');
  // Normalizar y probar varios formatos
  const formats = [
    /^(\d{4})[-/](\d{2})[-/](\d{2})$/, // 2026-07-01 o 2026/07/01
    /^(\d{8})$/, // 20260701
    /^(\d{2})[-/](\d{2})[-/](\d{4})$/, // 01-07-2026 o 01/07/2026
    /^(\d{2})(\d{2})(\d{4})$/ // 01072026
  ];
  let date: Date | null = null;
  for (const format of formats) {
    const match = input.match(format);
    if (match) {
      if (format === formats[0]) {
        date = new Date(`${match[1]}-${match[2]}-${match[3]}`);
      } else if (format === formats[1]) {
        date = new Date(`${input.slice(0,4)}-${input.slice(4,6)}-${input.slice(6,8)}`);
      } else if (format === formats[2]) {
        date = new Date(`${match[3]}-${match[2]}-${match[1]}`);
      } else if (format === formats[3]) {
        date = new Date(`${input.slice(4,8)}-${input.slice(2,4)}-${input.slice(0,2)}`);
      }
      break;
    }
  }
  if (!date) {
    // Intentar parseo estándar
    date = new Date(input);
  }
  if (isNaN(date.getTime())) {
    throw new LotValidateException('La fecha de recepción no tiene un formato válido.');
  }
  return date;
}

interface Prop {
  value: Date;
}

export class ReceivedDateVO extends ValueObject<Prop> {
  private constructor(prop: Prop) {
    super(prop);
  }

  static create(value: Date | string) {
    const dateValue = parseFlexibleDate(value);
    return new ReceivedDateVO({ value: dateValue });
  }

  get value() {
    return this.props.value;
  }
}
