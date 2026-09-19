"use server"

import { Result } from "@/shared/lib/utils/result";
import { RegisterEstablishmentDto } from "../../application/dtos/register-establishment.dto";
import { RegisterEstablishmentUseCase } from "../../application/use-cases/register-establishment.use-case";
import { TypeOrmEstablishmentRepository } from "../../infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository";
import { EstablishmentMapper } from "../../application/mappers/establishment.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { TypeOrmCustomerRepository } from "@/contexts/sale-management/customer/infraestructure/persistence/typeorm/repositories/typeorm-customer.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";

export async function createEstablishmentAction(dto: RegisterEstablishmentDto) {
        try {
                // Inyección de las dependencias
                const establishmentRepository = await TypeOrmEstablishmentRepository.create();
                const customerRepository = await TypeOrmCustomerRepository.create();
                const transactionDB = await TypeormTransactionDBRepository.create();
                const createEstablishmentUseCase = new RegisterEstablishmentUseCase(establishmentRepository, customerRepository, transactionDB);

                const resp = await createEstablishmentUseCase.execute(dto);
                return {
                        ...Result.success(EstablishmentMapper.toIResponse(resp))
                };
        } catch (error) {
                console.error('createEstablishmentAction: ', error);
                return {
                        ...handleError(error, 'createEstablishmentAction')
                }
        }
}
