import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { RegisterLotDTO } from "../application/dtos/register-lot.dto";
import { LotEntity } from "../domain/entities/lot.entity";
import { LotRepository } from "../domain/repositories/lot.repository";
import { UpdateLotDTO } from "../application/dtos/update-lot.dto";
import { LotMapper } from "./mappers/lot.mapper";

export class LotFetchRepositoryImpl implements LotRepository {
    private readonly URL = `${process.env.URL_EDYOF_PLATFORM_API}${process.env.PREFIX_EDYOF_PLATFORM_API}/lots`;

    async save(dto: RegisterLotDTO): Promise<Result<LotEntity, ErrorEntity>> {
        try {
            const httpDto = LotMapper.toRegisterLotHttpRequest(dto);
            const result = await fetch(`${this.URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(httpDto),
            });
            if (!result.ok) {
                const error = await result.json() as ErrorEntity;
                return Result.failure(error);
            }
            const season = await result.json() as LotEntity;
            return Result.success(season)
        } catch (error: any) {
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al servidor: Lot',
                statusCode: 500,
                path: `${process.env.PREFIX_EDYOF_PLATFORM_API}/lots`,
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }
    
    async update(dto: UpdateLotDTO): Promise<Result<LotEntity, ErrorEntity>> {
        try {
            const httpDto = LotMapper.toUpdateLotHttpRequest(dto);
            const result = await fetch(`${this.URL}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(httpDto),
            });
            if (!result.ok) {
                const error = await result.json() as ErrorEntity;
                return Result.failure(error);
            }
            const season = await result.json() as LotEntity;
            return Result.success(season)
        } catch (error: any) {
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al servidor: Lot',
                statusCode: 500,
                path: `${process.env.PREFIX_EDYOF_PLATFORM_API}/lots`,
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
        
    }
}