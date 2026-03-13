import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ValidateAuthUseCase } from "../../application/use-cases/validate-auth.use-case";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: ValidateAuthUseCase) {
    super({
      usernameField: 'email', // Le decimos a Passport que use 'email' como nombre de usuario
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // Un error común es no manejar el caso en que el usuario no exista o las credenciales sean incorrectas.
    // NestJS/Passport maneja esto lanzando UnauthorizedException si el resultado es null.
    const user = await this.authService.execute({email, password});
    if (!user) {
      throw new UnauthorizedException('Correo electrónico o contraseña incorrectos'); // Mensaje genérico por seguridad
    }
    // Si el usuario es validado, se adjunta a req.user
    return user;
  }
}