import { SeasonRepository } from "../../domain/repositories/season.repository";

export class ViewAllSeasonsUseCase{
    constructor(
        private readonly repository: SeasonRepository,
    ){}

    async execute(){
        const result = await this.repository.findAll();
        return result;
    }
}