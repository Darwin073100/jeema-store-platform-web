import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { EstablishmentRepository } from "../../domain/repositories/establishment.repository";
import { EstablishmentFetchRepositoryImpl } from "../establishment.fetch.repository.impl";

export class EstablishmentRepositoryFactory{
    public static create():EstablishmentRepository {
        const repository = new EstablishmentFetchRepositoryImpl(
            DependencyFactory.getHttpClient(),
            DependencyFactory.getApiConfig()
        );
        return repository;
    } 
}