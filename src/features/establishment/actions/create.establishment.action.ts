"use server"
import { CreateEstablishmentUseCase } from "@/features/establishment/application/use-case/create.establishment.use-case"
import { CreateEstablishmentDTO } from "../application/dtos/create-establishment.dto";
import { EstablishmentRepositoryFactory } from "../infraestructure/factories/establishment-repository.ractory";

export async function createEstablishmentAction(dto: CreateEstablishmentDTO){
        // Inyección de las dependencias
        const establishmentRepository = EstablishmentRepositoryFactory.create();
        const createEstablishmentUseCase = new CreateEstablishmentUseCase(establishmentRepository);

        const resp = await createEstablishmentUseCase.execute(dto);
        return {
                ...resp
        };
}