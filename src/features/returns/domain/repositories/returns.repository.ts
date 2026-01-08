import { Result } from "@/shared/features/result";
import { ReturnsEntity } from "../entities/returns.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { ReturnsProductsDTO } from "../../application/dtos/returns-products.dto";

export interface ReturnsRepository {
    saveAll(dto: ReturnsProductsDTO):Promise<Result<ReturnsEntity[], ErrorEntity>>;
    findAllByBranchOfficeId(branchOfficeId: bigint): Promise<Result<{returns: ReturnsEntity[]}, ErrorEntity>>;
}