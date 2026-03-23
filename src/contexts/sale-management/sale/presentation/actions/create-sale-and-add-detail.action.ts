'use server';
import { cookies } from "next/headers";
import { AddDetailToSaleDto } from "../../../../../features/sale/application/dtos/add-detail-to-sale.dto";
import { RegisterSaleDto } from "../../../../../features/sale/application/dtos/register-sale.dto";
import { CreateSaleAndAddDetailUseCase } from "../../../../../features/sale/application/use-case/create-sale-and-add-detail.use-case";
import { SaleRepositoryFactory } from "../../../../../features/sale/infraestructure/factory/sale-repository.factory";
import { BranchOfficeEntity } from "@/features/branch-office/domain/entities/branch-office.entity";

export async function CreateSaleAndAddDetailAction(saleId: bigint, customerId: bigint, cashRegisterId: bigint, addDetailDTO: AddDetailToSaleDto) {
    const repository = SaleRepositoryFactory.create();
    const useCase = new CreateSaleAndAddDetailUseCase(repository);

    const cookieStore = await cookies();
    let branchOffice;
    let employee;
    branchOffice = cookieStore.get("branchOfficeCookie")?.value;
    employee = cookieStore.get("employeeCookie")?.value;

    if (branchOffice && employee) {
        branchOffice = JSON.parse(branchOffice) as BranchOfficeEntity;
        employee = JSON.parse(employee) as any;

        const newRegisterDaleDto: RegisterSaleDto = {
            branchOfficeId: BigInt(branchOffice.branchOfficeId),
            employeeId: BigInt(employee.employeeId),
            customerId: customerId,
            cashRegisterId: cashRegisterId
        }
        const result = await useCase.execute(saleId, newRegisterDaleDto, addDetailDTO);
        return {
            ...result
        }
    } else {
        const newRegisterDaleDto: RegisterSaleDto = {
            branchOfficeId: BigInt(0),
            employeeId: BigInt(0),
            customerId: BigInt(0),
            cashRegisterId: BigInt(0),
        }
        const result = await useCase.execute(saleId, newRegisterDaleDto, addDetailDTO);
        return {
            ...result
        }

    }
}