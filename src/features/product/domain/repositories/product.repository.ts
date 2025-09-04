import { Result } from "@/shared/features/result";
import { ProductEntity } from "../entities/product.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterProductDTO } from "../../application/dtos/register-product.dto";
import { RegisterInitialProductDTO } from "../../application/dtos/register-initial-product.dto";
import { UpdateProductDTO } from "../../application/dtos/update-product.dto";

export interface ProductRepository{
    findAll():Promise<Result<{products: ProductEntity[]}, ErrorEntity>>;
    save(dto: RegisterProductDTO):Promise<Result<ProductEntity, ErrorEntity>>;
    update(dto: UpdateProductDTO):Promise<Result<ProductEntity, ErrorEntity>>;
    saveProductWithLotAndInventory(dto: RegisterInitialProductDTO):Promise<Result<ProductEntity, ErrorEntity>>;
    delete(productId: bigint): Promise<Result<any, ErrorEntity>|undefined>;
}