import { PermissionCheckerPort } from "src/contexts/authentication-management/permission/domain/ports/out/permission-checker.port";
import { RoleEntity } from "../../domain/entities/role-entity";
import { RolePermissionEntity } from "../../domain/entities/role-permission.entity";
import { RolePermissionRepository } from "../../domain/repositories/role-permission.repositoy";
import { RoleRepository } from "../../domain/repositories/role.repository";
import { RoleDescriptionVO } from "../../domain/value-objects/role-description.vo";
import { RoleNameVO } from "../../domain/value-objects/role-name.vo";
import { RegisterRoleDto } from "../dtos/register-role.dto";
import { NotFoundPermissionException } from "src/contexts/authentication-management/permission/domain/exceptions/not-found-permission.exception";

/**
 * RegisterCategoryUseCase es un Caso de Uso (o Servicio de Aplicación).
 * Contiene la lógica de orquestación para el proceso de registro de un centro educativo.
 * No contiene lógica de negocio pura, sino que coordina a las entidades de dominio y repositorios.
 */
export class RegisterRoleUseCase {
  constructor(
    // Inyectamos la interfaz del repositorio, no una implementación concreta.
    // Esto es Inversión de Dependencias.
    private readonly rolePermissionRepository : RolePermissionRepository,
    private readonly permissionCheckerPort    : PermissionCheckerPort,
  ) {}

  /**
   * Ejecuta el caso de uso para registrar un nuevo centro educativo.
   *
   * @param command El DTO que contiene los datos para el registro.
   * @returns Una Promesa que se resuelve con la entidad Category creada.
   * @throws Error si el nombre no es válido (validación del Value Object Name).
   */
  public async execute(command: RegisterRoleDto): Promise<RolePermissionEntity> {

    const permissionExist                     = await this.permissionCheckerPort.check(command.permissionId);

    if(!permissionExist){
      throw new NotFoundPermissionException('El permiso asignado a este rol no existe.');
    }

    const name                                = RoleNameVO.create(command.name);
    const description                         = RoleDescriptionVO.create(command.description);
    const roleId                              = BigInt(Date.now());
    const newRole                             = RoleEntity.create(roleId, name,description);
    const rolePermissionId                    = BigInt(Date.now());
    const newRoleWhitPermission               = RolePermissionEntity.create(rolePermissionId,command.permissionId, newRole);
    const savedEntity                         = await this.rolePermissionRepository.save(newRoleWhitPermission);
    const domainEvents                        = newRole.getAndClearEvents();

    // 5. Retornar el resultado.
    return savedEntity;
  }
}