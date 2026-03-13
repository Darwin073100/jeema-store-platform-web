import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeasonOrmEntity } from './infraestructure/persistence/typeorm/entities/season.orm-entity';
import { SeasonController } from './presentation/controllers/season.controller';
import { RegisterSeasonUseCase } from './application/use-cases/register-season.use-case';
import { SEASON_REPOSITORY, SeasonRepository } from './domain/repositories/season.repository';
import { TypeormSeasonRepository } from './infraestructure/persistence/typeorm/repositories/typeorm-season.repository';
import { SEASON_CHECKER_PORT } from './domain/ports/out/season-checker.port';
import { ViewAllSeasonsUseCase } from './application/use-cases/view-all-seasons.use-case';
import { TypeormSeasonCheckerAdapter } from './infraestructure/persistence/typeorm/external-services/typeorm-season-checker.adapter';
import { UpdateSeasonUseCase } from './application/use-cases/update-season.use-case';
import { DeleteSeasonUseCase } from './application/use-cases/delete-season.use-case';
import { FindAllSeasonsByEstablishmentUseCase } from './application/use-cases/find-all-seasons-by-establishment.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([SeasonOrmEntity])],
  controllers: [SeasonController],
  providers: [
    {
      provide: SEASON_REPOSITORY,
      useClass: TypeormSeasonRepository
    },
    {
      provide: SEASON_CHECKER_PORT,
      useClass: TypeormSeasonCheckerAdapter,
    },
    {
      provide: RegisterSeasonUseCase,useFactory: (repo: SeasonRepository) => { return new RegisterSeasonUseCase(repo); },
      inject: [SEASON_REPOSITORY],
    },
    {
      provide: ViewAllSeasonsUseCase, useFactory: (repository: SeasonRepository)=> { return new ViewAllSeasonsUseCase(repository)},
      inject: [SEASON_REPOSITORY]
    },
    {
      provide: FindAllSeasonsByEstablishmentUseCase, useFactory: (repository: SeasonRepository)=> { return new FindAllSeasonsByEstablishmentUseCase(repository)},
      inject: [SEASON_REPOSITORY]
    },
    {
      provide: UpdateSeasonUseCase, useFactory: (repository: SeasonRepository)=> { return new UpdateSeasonUseCase(repository)},
      inject: [SEASON_REPOSITORY]
    },
    {
      provide: DeleteSeasonUseCase, useFactory: (repository: SeasonRepository)=> { return new DeleteSeasonUseCase(repository)},
      inject: [SEASON_REPOSITORY]
    },
  ],
  exports: [
    SEASON_CHECKER_PORT
  ]
})
export class SeasonModule {}
