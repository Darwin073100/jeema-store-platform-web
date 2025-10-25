import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { RoleRepository } from "../../domain/repositories/role.repository";
import { RoleFetchRepositoryImpl } from "../repositories/role-fetch-repository.impl";

export class RoleRepositoryFactory{
    public static create():RoleRepository{
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();
            
        return new RoleFetchRepositoryImpl(httpClient, apiConfig);
    }
}