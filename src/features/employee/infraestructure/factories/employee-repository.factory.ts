import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { EmployeeRepository } from "../../domain/repositories/employee.repository";
import { EmployeeFetchRepository } from "../repositories/employee-fetch.repository";

export class EmployeeRepositoryFactory{
    public static create():EmployeeRepository{
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();
            
        return new EmployeeFetchRepository(httpClient, apiConfig);
    }
}