import { CloudTransferItemRepository } from "../../domain/repositories/cloud-transfer-item.repository";
import { ProductRepository } from "src/contexts/product-management/product/domain/repositories/product.repository";
import { InventoryRepository } from "src/contexts/inventory-management/inventory/domain/repositories/inventory.repository";
import { CloudTransferItemEntity } from "../../domain/entities/cloud-transfer-item.entity";
import { ResolveCloudTransferItemAsExistingProductDto } from "../dtos/resolve-cloud-transfer-item-as-existing-product.dto";
import { CloudTransferItemNotFoundException } from "../../domain/exceptions/cloud-transfer-item-not-found.exception";

/**
 * Verifica que el producto exista; busca (o deja null) su Inventory en la sucursal de B;
 * `item.resolveAsExistingProduct(...)`; guarda. NO muta stock (eso ocurre recién en
 * `ApproveCloudTransferUseCase`). Ver spect/08_cloud_transfer_spect.md sección 5.9.
 */
export class ResolveCloudTransferItemAsExistingProductUseCase {
    constructor(
        private readonly cloudTransferItemRepository: CloudTransferItemRepository,
        private readonly productRepository: ProductRepository,
        private readonly inventoryRepository: InventoryRepository,
    ) { }

    async execute(dto: ResolveCloudTransferItemAsExistingProductDto): Promise<CloudTransferItemEntity> {
        const item = await this.cloudTransferItemRepository.findById(dto.cloudTransferItemId);
        if (!item) {
            throw new CloudTransferItemNotFoundException(`No se encontró el item de traspaso (${dto.cloudTransferItemId}).`);
        }

        const product = await this.productRepository.existById(dto.matchedLocalProductId);
        if (!product) {
            throw new CloudTransferItemNotFoundException(`El producto local (${dto.matchedLocalProductId}) no existe.`);
        }

        const inventories = await this.inventoryRepository.findAllByProductId(product.productId);
        const inventoryMatch = inventories.find(inv => inv.branchOfficeId === dto.branchOfficeId);

        item.resolveAsExistingProduct(product.productId, inventoryMatch?.inventoryId ?? null);
        return this.cloudTransferItemRepository.save(item);
    }
}
