import { CategoryEntity } from "../../domain/entities/category-entity";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { RegisterCategoryDto } from "../dtos/register-category.dto";

export class RegisterCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) {}

  /**
   * Ejecuta el caso de uso para registrar un nuevo centro educativo.
   *
   * @param command El DTO que contiene los datos para el registro.
   * @returns Una Promesa que se resuelve con la entidad Category creada.
   * @throws Error si el nombre no es válido (validación del Value Object Name).
   */
  public async execute(command: RegisterCategoryDto): Promise<CategoryEntity> {
    const newCategory = CategoryEntity.create( command.establishmentId, command.name, command.description);
    const savedEntity = await this.categoryRepository.save(newCategory);
    return savedEntity;
  }
}