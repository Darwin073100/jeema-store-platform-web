import { RoleEntity } from "../../domain/entities/role-entity";
import { RoleRepository } from "../../domain/repositories/role.repository";

/**
 * RegisterCategoryUseCase es un Caso de Uso (o Servicio de Aplicación).
 * Contiene la lógica de orquestación para el proceso de registro de un centro educativo.
 * No contiene lógica de negocio pura, sino que coordina a las entidades de dominio y repositorios.
 */
export class FindAllRoleUseCase {
  constructor(
    private readonly roleRepository : RoleRepository,
  ) {}

  /**
   * Ejecuta el caso de uso para registrar un nuevo centro educativo.
   *
   * @param command El DTO que contiene los datos para el registro.
   * @returns Una Promesa que se resuelve con la entidad Category creada.
   * @throws Error si el nombre no es válido (validación del Value Object Name).
   */
  public async execute(): Promise<RoleEntity[]> {
    const result = await this.roleRepository.findAll();
    return result;
  }
}