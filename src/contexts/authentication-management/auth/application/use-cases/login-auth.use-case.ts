import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/contexts/authentication-management/auth/domain/entities/user.entity";

export class loginAuthUseCase{
    constructor(
    private readonly jwtService: JwtService,
  ) {}

    // Este método es para generar el JWT después de una validación exitosa
  async execute(user: UserEntity): Promise<{ accessToken: string }> {
    const payload = {
      username: user.username?.value,
      email: user.email?.value,
      userId: user.userId?.toString(), // Convertir bigint a string para evitar error de serialización
      permissions: user.userRoles?.flatMap(role => role.permissions) || [],
      roles: user.userRoles?.map(role => role.roleName) || [],
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}