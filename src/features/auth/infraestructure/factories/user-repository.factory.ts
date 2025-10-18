import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UserFetchRepositoryImpl } from "../repositories/user-fetch-repository.impl";

export class UserRepositoryFactory{
    public static create():UserRepository{
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();
            
        return new UserFetchRepositoryImpl(httpClient, apiConfig);
    }
}