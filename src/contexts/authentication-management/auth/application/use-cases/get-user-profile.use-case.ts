import { UserRepository } from "../../domain/repositories/user.repository";
import { UserNotFoundException } from "../../domain/exceptions/user-not-found.exception";
import { UserEntity } from "../../domain/entities/user.entity";

export class GetUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: bigint): Promise<UserEntity> {
    // 1. Obtener el usuario con todas sus relaciones cargadas
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
