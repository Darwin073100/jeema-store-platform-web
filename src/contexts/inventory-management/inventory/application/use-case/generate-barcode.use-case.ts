import { ProductRepository } from "src/contexts/product-management/product/domain/repositories/product.repository";
import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { InventoryRepository } from "../../domain/repositories/inventory.repository";
import { ProductEntity } from "src/contexts/product-management/product/domain/entities/product.entity";

export class GenerateBarcodeUseCase {
    constructor(
        private readonly inventoryRepository: InventoryRepository,
        private readonly productRepository: ProductRepository
    ){}

    async execute( establishmentId: bigint, branchOfficeId: bigint ):Promise<string>{
        let day: number;
        let month: number;
        let year: number;
        let tiem: string;
        let barcode: string;
        let inventoryExist: InventoryEntity | null;
        let productExist: ProductEntity | null;
        do{
            day = new Date().getDay();
            month = new Date().getMonth();
            year = new Date().getFullYear();
            tiem = new Date().getTime().toString().substring(9);
            barcode = `${day}${month}${year}${tiem}`;
            
            inventoryExist = await this.inventoryRepository.findByInternalBarCodeInBranchOffice( barcode, branchOfficeId );
            productExist = await this.productRepository.findByEstablishmentAndUniversalBarCode( establishmentId, barcode );
            
        } while(inventoryExist || productExist);
        return barcode;
    }
}