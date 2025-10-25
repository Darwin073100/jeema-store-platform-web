import { Result } from "@/shared/features/result";
import { RoleEntity } from "../entities/role.entity";
import { ErrorEntity } from "@/shared/features/error.entity";

export interface RoleRepository {
    findAllRole(): Promise<Result<{roles: RoleEntity[]}, ErrorEntity>>
}