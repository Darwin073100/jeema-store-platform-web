import { RoleResponseDto } from "src/contexts/authentication-management/role/application/dtos/role-response.dto";
import { UserResponseDTO } from "./user-response.dto";

export class UserRoleResponseDTO {
    userId: string;
    roleId: string;
    userRoleId: string;
    createdAt: Date;
    user: UserResponseDTO | null;
    role: RoleResponseDto | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
}