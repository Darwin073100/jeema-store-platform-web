import { Module } from "@nestjs/common";
import { EMPLOYEE_CHECKER_PORT } from "./domain/ports/out/employee-checker.port";
import { TypeormEmployeeCheckerAdapter } from "./infraestruture/persistence/typeorm/external-services/typeorm-employee-checker.adapter";

// employee-management/employee/employee-shared.module.ts
@Module({
  // No necesitas controllers o TypeORM aquí.
  providers: [
      // 🔑 Asegúrate de que el EmployeeChekerPort esté declarado aquí
      { 
          provide: EMPLOYEE_CHECKER_PORT, 
          useClass: TypeormEmployeeCheckerAdapter // o la clase concreta
      },
  ],
  exports: [
      // 🔑 Exporta SOLO el puerto/servicio que AuthModule necesita
      EMPLOYEE_CHECKER_PORT 
  ],
})
export class EmployeeSharedModule {}