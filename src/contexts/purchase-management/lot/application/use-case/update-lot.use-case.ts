import { LotEntity } from "../../domain/entities/lot.entity";
import { LotRepository } from "../../domain/repositories/lot.repository";
import { ProductNotFoundException } from "src/contexts/product-management/product/domain/exceptions/product-not-found.exception";
import { UpdateLotDto } from "../dtos/update-lot.dto";
import { ProductRepository } from "@/contexts/product-management/product/domain/repositories/product.repository";

/**
 * Esta clase UpdateLotUseCase puede utilizarce para actualizar la informacion de un lote que pertenece a un producto.
 * @constructor
 * @param lotRepository LotRepository
 * @param productCheckerPort ProductCheckerPort
 */
export class UpdateLotUseCase {
    constructor(
        private readonly lotRepository: LotRepository,
        private readonly productRepository: ProductRepository,
    ) { }

    /**
     * Metodo que ejecuta este caso de uso
     * @param dto UpdateLotDto
     * @returns Promise LotEntity
     */
    async execute(dto: UpdateLotDto): Promise<LotEntity> {
        // Validar que el producto existe
        const productExists = await this.productRepository.existById(dto.productId);

        if (!productExists) {
            throw new ProductNotFoundException(`El producto con ID ${dto.productId} no existe.`);
        }

        const lot = LotEntity.reconstitute(
            dto.lotId,
            dto.productId,
            dto.suplierId && dto.suplierId > BigInt(0)? dto.suplierId: null,
            dto.lotNumber,
            dto.purchasePrice,
            dto.initialQuantity,
            dto.purchaseUnit,
            dto.receivedDate,
            dto.expirationDate,
            dto.manufacturingDate,
            new Date(),
            null,
            null,
            null,
            null,
            null,
        );

        const result = await this.lotRepository.save(lot);

        return result;
    }
}