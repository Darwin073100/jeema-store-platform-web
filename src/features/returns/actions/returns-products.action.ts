'use server'
import { cookies } from "next/headers";
import { ReturnsProductsDTO } from "../application/dtos/returns-products.dto";
import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";
import { EmployeeEntity } from "@/features/employee/domain/entities/employee.entity";
import { ReturnsRepositoryFactory } from "../infraestructure/factories/returns-repository.factory";
import { ReturnsProductsUseCase } from "../application/use-cases/returns-products.use-case";
import { revalidatePath } from "next/cache";
import { FindCashSessionByEmployeeIdUseCase } from "@/features/cash/application/use-cases/find-cash-session-by-employee-id.use-case";
import { CashFetchRepositoryFactory } from "@/features/cash/infraestructure/factories/cash-fetch-repository.factory";

export async function returnsProductsAction(dto: ReturnsProductsDTO){
    const repository = ReturnsRepositoryFactory.create();
    const cashRepo = CashFetchRepositoryFactory.create();
    const findCashSessionByEmployeeIdUseCase = new FindCashSessionByEmployeeIdUseCase(cashRepo);
    const useCase = new ReturnsProductsUseCase(repository, findCashSessionByEmployeeIdUseCase);

    const cookieStore = await cookies();                  
    let branchOffice = cookieStore.get('branchOfficeCookie')?.value ?? null;
    let branchOfficeId = BigInt(0);
    if (branchOffice) {
        branchOfficeId = (JSON.parse(branchOffice) as BranchOfficeEntity).branchOfficeId;
    }
    let employee = cookieStore.get('employeeCookie')?.value ?? null;
    let employeeId = BigInt(0);
    if (employee) {
        employeeId = (JSON.parse(employee) as EmployeeEntity).employeeId;
    }

    const currentDTO = {
        ...dto,
        branchOfficeId,
        employeeId
    };

    const result = await useCase.execute(currentDTO);

    if(result.ok){
        revalidatePath('/sale');
    }
    return {
        ...result
    }
}