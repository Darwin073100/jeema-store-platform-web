import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { RegisterSeasonUseCase } from "../../application/use-cases/register-season.use-case";
import { RegisterSeasonDto } from "../../application/dtos/register-season.dto";
import { RegisterSeasonRequestDto } from "../dtos/register-season-request.dto";
import { SeasonMapper } from "../../application/mappers/season-mapper";
import { SeasonResponseDto } from "../../application/dtos/season-response.dto";
import { SeasonAlreadyExistsException } from "../../domain/exceptions/season-already-exists.exception";
import { InvalidSeasonException } from "../../domain/exceptions/invalid-season.exception";
import { ViewAllSeasonsUseCase } from "../../application/use-cases/view-all-seasons.use-case";
import { UpdateSeasonUseCase } from "../../application/use-cases/update-season.use-case";
import { DeleteSeasonUseCase } from "../../application/use-cases/delete-season.use-case";
import { UpdateSeasonRequestDto } from "../dtos/update-season-request.dto";
import { SeasonNotFoundException } from "../../domain/exceptions/season-not-found.exception";
import { UpdateSeasonDto } from "../../application/dtos/update-season.dto";
import { FindAllSeasonsByEstablishmentUseCase } from "../../application/use-cases/find-all-seasons-by-establishment.use-case";

@Controller('seasons')
export class SeasonController {
  constructor(
    private readonly registerSeasonUseCase: RegisterSeasonUseCase,
    private readonly viewAllSeasonsUseCase: ViewAllSeasonsUseCase,
    private readonly updateSeasonUseCase: UpdateSeasonUseCase,
    private readonly deleteSeasonUseCase: DeleteSeasonUseCase,
    private readonly findAllSeasonsByEstablishmentUseCase: FindAllSeasonsByEstablishmentUseCase
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerSeason(
    @Body() registerRequestDto: RegisterSeasonRequestDto
  ): Promise<SeasonResponseDto> {
    try {
      const registerAppDto: RegisterSeasonDto = {
        establishmentId:registerRequestDto.establishmentId,
        name: registerRequestDto.name,
        description: registerRequestDto.description ?? null,
        dateInit: registerRequestDto.dateInit ? new Date(registerRequestDto.dateInit) : null,
        dateFinish: registerRequestDto.dateFinish ? new Date(registerRequestDto.dateFinish) : null,
      };

      const season = await this.registerSeasonUseCase.execute(registerAppDto);

      return SeasonMapper.toResponseDto(season);
    } catch (error) {
      if (error instanceof InvalidSeasonException) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof SeasonAlreadyExistsException)
        throw new ConflictException(error.message);

      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async viewAllSeasons() {
    try {
      const result = await this.viewAllSeasonsUseCase.execute();
      const seasonList = result.map(item => SeasonMapper.toResponseDto(item));
      return {
        seasons: seasonList
      }

    } catch (error) {
      throw error;
    }
  }
  @Get('establishments/:establishmentId')
  @HttpCode(HttpStatus.OK)
  async findAllSeasonsByEstablishment(@Param('establishmentId') establishmentId: string) {
    try {
      const result = await this.findAllSeasonsByEstablishmentUseCase.execute(BigInt(establishmentId));
      const seasonList = result.map(item => SeasonMapper.toResponseDto(item));
      return {
        seasons: seasonList
      }

    } catch (error) {
      throw error;
    }
  }

  @Patch()
  async updateSeason(
    @Body() updateSeasonRequestDto: UpdateSeasonRequestDto
  ) {
    const season:UpdateSeasonDto = {
      seasonId: updateSeasonRequestDto.seasonId,
      name: updateSeasonRequestDto.name,
      description: updateSeasonRequestDto.description,
      dateInit: updateSeasonRequestDto.dateInit ? new Date(updateSeasonRequestDto.dateInit): null,
      dateFinish: updateSeasonRequestDto.dateFinish ? new Date(updateSeasonRequestDto.dateFinish): null,
    }
    try {
      const updatedSeason = await this.updateSeasonUseCase.execute(season);
      return SeasonMapper.toResponseDto(updatedSeason);
    } catch (error) {
      if (error instanceof SeasonNotFoundException) {
        throw new NotFoundException(error.message);
      }
      // Manejo de errores
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSeason(
    @Param('id', ParseIntPipe) id: bigint
  ) {
    try {
      await this.deleteSeasonUseCase.execute(id);
    } catch (error) {
      if (error instanceof SeasonNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
