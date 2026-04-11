import { UserRepository } from "../../domain/repositories/user.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserNotFoundException } from "../../domain/exceptions/user-not-found.exception";

export class GetUserWorkspaceUseCase {
  constructor(
      private readonly userRepository: UserRepository,
    ) {}
  
    async execute(userId: bigint): Promise<UserEntity> {
      if(userId <= BigInt(0)){
        throw new Error('Ha ocurrido un error en el servidor.');
      }
      // 1. Obtener el usuario con todas sus relaciones cargadas
      const user = await this.userRepository.findByIdWithWorkspace(userId);
      if (!user) {
        throw new UserNotFoundException('Usuario no encontrado');
      }
      return user;
    }
}
