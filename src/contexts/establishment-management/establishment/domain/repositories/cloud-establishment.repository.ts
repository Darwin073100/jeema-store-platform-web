import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { Result } from "@/shared/lib/utils/result";

export interface  CloudEstablishmentRepository {
    generateEnrollmentKey(): Promise<Result<{ enrollmentKey: string; }, ErrorEntity>>
}