import { LotRepository } from "../../domain/repositories/lot.repository";
import { UpdateLotDTO } from "../dtos/update-lot.dto";

export class UpdateLotUseCase{
    constructor(
        private readonly repository: LotRepository
    ){}

    async execute(dto: UpdateLotDTO){
        const result = await this.repository.update(dto);
        return result; 
    }
}