import { Result } from "@/shared/features/result";
import { ProductEntity } from "../entities/product.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterProductDTO } from "../../application/dtos/register-product.dto";
import { RegisterInitialProductDTO } from "../../application/dtos/register-initial-product.dto";
import { UpdateProductDTO } from "../../application/dtos/update-product.dto";
import { RegisterCompleteProductDTO } from "../../application/dtos/register-complete-product.dto";

export interface ProductRepository{
    findAll():Promise<Result<{products: ProductEntity[]}, ErrorEntity>>;
    save(dto: RegisterProductDTO):Promise<Result<ProductEntity, ErrorEntity>>;
    update(dto: UpdateProductDTO):Promise<Result<ProductEntity, ErrorEntity>>;
    saveProductWithLotAndInventory(dto: RegisterInitialProductDTO):Promise<Result<ProductEntity, ErrorEntity>>;
    delete(productId: bigint): Promise<Result<any, ErrorEntity>|undefined>;
    registerCompleteProduct(dto: RegisterCompleteProductDTO): Promise<Result<ProductEntity, ErrorEntity>>;
    findAllByEstablishment(establishmentId: bigint): Promise<Result<{products: ProductEntity[]}, ErrorEntity>>;
}