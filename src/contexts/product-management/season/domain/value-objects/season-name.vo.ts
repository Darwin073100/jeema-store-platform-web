import { InvalidSeasonException } from "../exceptions/invalid-season.exception";

export class SeasonNameVO {
  private constructor(public readonly value: string) {}

  static create(value: string): SeasonNameVO {
    if (!value || value.trim().length < 3 ) {
      throw new InvalidSeasonException('La temporada debe tener como mínimo 3 caracteres.');
    }
    if (!value || value.length > 100) {
      throw new InvalidSeasonException('La temporada no debe ser mayor a 100 caracteres.');
    }
    if(!value || value === ''){
      throw new InvalidSeasonException('La temporada no puede estar vacía.');
    }
    return new SeasonNameVO(value.trim());
  }
}
