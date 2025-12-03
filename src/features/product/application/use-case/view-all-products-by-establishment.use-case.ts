import { ProductRepository } from "../../domain/repositories/product.repository";

export class ViewAllProductsByEstablishmentUseCase{
    constructor(
        private readonly repository: ProductRepository
    ){}

    async execute(establishmentId: bigint){
        const result = await this.repository.findAllByEstablishment(establishmentId);
        return result;
    }
}