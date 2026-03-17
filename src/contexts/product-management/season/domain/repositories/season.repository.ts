import { TemplateRepository } from 'src/shared/domain/repositories/template.repository';
import { SeasonEntity } from '../entities/season.entity';

export const SEASON_REPOSITORY = Symbol('SEASON_REPOSITORY');

export interface SeasonRepository extends TemplateRepository<SeasonEntity> {
  findAllByEstablishment(establishmentId: bigint): Promise<SeasonEntity[]>;
  existById(seasonId: bigint): Promise<SeasonEntity | null>;
}
