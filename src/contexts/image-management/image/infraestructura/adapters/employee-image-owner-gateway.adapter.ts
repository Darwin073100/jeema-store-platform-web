import { ImageOwnerGatewayPort } from 'src/contexts/image-management/image/domain/ports/out/image-owner-gateway.port';
import { EmployeeRepository } from 'src/contexts/employee-management/employee/domain/repositories/employee.repository';

/**
 * Adaptador de `ImageOwnerGatewayPort` para dueños de tipo EMPLOYEE.
 * Reutiliza directamente `EmployeeRepository`, sin ningún checker port nuevo.
 */
export class EmployeeImageOwnerGatewayAdapter implements ImageOwnerGatewayPort {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async exists(ownerId: bigint): Promise<boolean> {
    const employee = await this.employeeRepository.existById(ownerId);
    return employee !== null;
  }

  async updatePrimaryImageUrl(ownerId: bigint, url: string | null): Promise<void> {
    const employee = await this.employeeRepository.findById(ownerId);
    if (!employee) return;
    employee.updatePhotoUrl(url);
    await this.employeeRepository.update(employee);
  }
}
