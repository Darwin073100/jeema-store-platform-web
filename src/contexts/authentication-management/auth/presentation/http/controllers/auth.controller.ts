import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ValidateAuthUseCase } from "../../../application/use-cases/validate-auth.use-case";
import { loginAuthUseCase } from '../../../application/use-cases/login-auth.use-case';
import { HasPermission } from "src/shared/decorators/has-permission.decorator";
import { PermissionsGuard } from "src/shared/guards/permissions.guard";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { GetUserProfileUseCase } from "../../../application/use-cases/get-user-profile.use-case";
import { UserMapper } from "../../../application/mapper/user.mapper";
import { GetUserWorkspaceUseCase } from "../../../application/use-cases/get-user-workspace.use-case";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly validateAuthUseCase: ValidateAuthUseCase,
        private readonly loginAuthUseCase: loginAuthUseCase,
        private readonly getUserProfileUseCase: GetUserProfileUseCase,
        private readonly getUserWorkspaceUseCase: GetUserWorkspaceUseCase,
    ) { }
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('local'))
    async login(@Request() req: any) {
        // req.user contiene el usuario autenticado
        return this.loginAuthUseCase.execute(req.user);
    }

    @Get('create') // Ruta de ejemplo que requiere permiso de creación
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @HasPermission('user:read_all') // Requiere el permiso de creación de establecimiento
    @HttpCode(HttpStatus.CREATED)
    createEstablishment(@Request() req) {
        return {
            message: `Establecimiento creado por ${req.user.username}. Requiere permiso 'establishment:create'.`,
            user: req.user
        };
    }

    @Get('profile') // Obtener perfil completo del usuario autenticado
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getProfile(@Request() req) {
        const userId = req.user.userId;
        const profile = await this.getUserProfileUseCase.execute(BigInt(userId));
        const response = UserMapper.toProfileResponse(profile);
        return response;
    }

    @Get('workspace-info') // Obtener información del área de trabajo (establecimiento/sucursal)
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getWorkspaceInfo(@Request() req) {
        // Por ahora retornar información básica usando los datos del perfil
        const userId = req.user.userId;
        const profile = await this.getUserWorkspaceUseCase.execute(BigInt(userId));
        const response = UserMapper.toUserWorkspaceResponse(profile);
        return response;
    }
}