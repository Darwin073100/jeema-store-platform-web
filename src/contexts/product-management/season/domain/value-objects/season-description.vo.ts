export class SeasonDescriptionVO {
  private constructor(public readonly value: string | null) {}

  static create(value?: string | null): SeasonDescriptionVO | null {
    if (!value) return null;
    if (value.length < 3) {
      throw new Error('La descripción debe tener al menos 3 caracteres.');
    }
    return new SeasonDescriptionVO(value);
  }
}
