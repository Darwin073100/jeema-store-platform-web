'use server'
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { RegisterSuplierDto } from "../../application/dtos/register-suplier.dto";
import { TypeOrmSuplierRepository } from "../../infraestructure/persistence/typeorm/repositories/typeorm-suplier.repository";
import { RegisterSuplierUseCase } from "../../application/use-cases/register-suplier.use-case";
import { TypeOrmEstablishmentRepository } from "@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository";
import { IEstablishment } from "@/contexts/establishment-management/establishment/presentation/interfaces/IEstablishment";
import { Result } from "@/shared/lib/utils/result";
import { SuplierMapper } from "../../application/mappers/suplier.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { TypeormAddressRepository } from "@/contexts/establishment-management/address/infraestructure/infraestructure/typeorm-address.repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";

export async function registerSuplierAction(dto: Omit<RegisterSuplierDto, 'establishmentId'>) {
    try {
        const suplierRepository = await TypeOrmSuplierRepository.create();
        const establishmentRepository = await TypeOrmEstablishmentRepository.create();
        const addressRepository = await TypeormAddressRepository.create();
        const transaction = await TypeormTransactionDBRepository.create();
        const useCase = new RegisterSuplierUseCase(suplierRepository, establishmentRepository, addressRepository, transaction);

        const cookieStore = await cookies();
        let establishmentCookie = cookieStore.get('establishmentCookie')?.value;
        let establishmentId = BigInt(0);
        if (establishmentCookie) {
            const establishmentJSON = JSON.parse(establishmentCookie) as IEstablishment;
            establishmentId = establishmentJSON.establishmentId;
        }

        const currentDto: RegisterSuplierDto = {
            ...dto,
            establishmentId
        }

        const result = await useCase.execute(currentDto);

        revalidatePath('/purchases/supliers');

        return {
            ...Result.success(SuplierMapper.toIResponse(result))
        }
    } catch (error) {
        console.error('registerSuplierAction: ', error);
        return {
            ...handleError(error, 'registerSuplierAction')
        }
    }
}