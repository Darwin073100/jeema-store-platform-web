import { AddressMapper } from "@/shared/application/mappers/address.mapper";
import { RegisterEmployeeDTO } from "../../application/dtos/register-employee.dto";
import { RegisterEmployeeHttpDTO } from "../dtos/register-employee-http.dto";
import { UpdateEmployeeHttpDTO } from "../dtos/update-employee-http.dto";
import { UpdateEmployeeDTO } from "../../application/dtos/update-employee.dto";

export class EmployeeMapper {
    public static toRegisterEmployeeHttpDTO(dto: RegisterEmployeeDTO){
        const httpDTO: RegisterEmployeeHttpDTO = {
            branchOfficeId: dto.branchOfficeId.toString(),
            employeeRoleId: dto.employeeRoleId.toString(),
            email: (dto.email && (dto.email.trim().length > 0))? dto.email: undefined ,
            birthDate: dto.birthDate?.toISOString() ?? undefined,
            currentSalary: Number(dto.currentSalary),
            entryTime: dto.entryTime?.toString() ?? undefined,
            exitTime: dto.exitTime?.toString() ?? undefined,
            firstName: dto.firstName,
            lastName: dto.lastName,
            gender: dto.gender && (dto.gender.trim().length > 1) ? dto.gender: undefined,
            hireDate: dto.hireDate.toISOString(),
            isActive: dto.isActive,
            phoneNumber: dto.phoneNumber,
            photoUrl: dto.photoUrl ?? undefined,
            terminationDate: dto.terminationDate?.toISOString(),
            address: dto.address? AddressMapper.toRegisterAddressHttpDTO(dto.address): undefined,
            user: undefined
            // user: dto.user? UserMapper.toRegisterUserHttpDTO(dto.user): undefined,
        }
        return httpDTO;
    }
    public static toUpdateEmployeeHttpDTO(dto: UpdateEmployeeDTO){
        const httpDTO: UpdateEmployeeHttpDTO = {
            branchOfficeId: dto.branchOfficeId?.toString(),
            employeeRoleId: dto.employeeRoleId?.toString(),
            email: dto.email && dto.email?.trim().length > 0? dto.email: null,
            birthDate: dto.birthDate?.toISOString(),
            currentSalary: Number(dto.currentSalary),
            entryTime: dto.entryTime?.toString(),
            exitTime: dto.exitTime?.toString(),
            firstName: dto.firstName,
            lastName: dto.lastName,
            gender: dto.gender,
            hireDate: dto.hireDate?.toISOString(),
            isActive: dto.isActive,
            phoneNumber: dto.phoneNumber,
            photoUrl: dto.photoUrl,
            terminationDate: dto.terminationDate?.toISOString(),
            // user: dto.user? UserMapper.toRegisterUserHttpDTO(dto.user): undefined,
        }
        return httpDTO;
    }
}