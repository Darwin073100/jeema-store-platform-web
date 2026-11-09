import TimeMaster from "@/shared/lib/utils/TimeMaster";
import { FilterTopEnum } from "../../domain/enums/FilterTopEnum";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { InvalidSalesPeriodException } from "../../domain/exceptions/invalid-sales-period.exception";
import { TopSellingProductsCriteria } from "../../domain/read-models/top-selling-product.read-model";
import { TopProductsResponseDto } from "../dtos/products-top-by-branch-office-response.dto";
import { FilterTopRequestDTO } from "../dtos/filter-top.dto";

export const TOP_PRODUCTS_DEFAULT_LIMIT = 10;
export const TOP_PRODUCTS_MAX_LIMIT = 100;

interface Period {
    start: Date;
    /** Exclusivo: primer instante fuera del periodo. */
    end: Date;
}

/** `YYYY-MM-DD` → medianoche local de ese día. */
const parseDay = (value: string): Date => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const formatDay = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const addDays = (date: Date, days: number): Date =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const monthPeriod = (year: number, monthIndex: number): Period => ({
    start: new Date(year, monthIndex, 1),
    end: new Date(year, monthIndex + 1, 1),
});

/**
 * Top de productos más vendidos de una sucursal, por volumen y por monto.
 * Por defecto: mes actual, todas las categorías, 10 productos.
 */
export class FindTopProductsByBranchOfficeUseCase{
    constructor(
        private readonly productRepository: ProductRepository
    ){}

    async execute(branchOfficeId: bigint, dto: FilterTopRequestDTO): Promise<TopProductsResponseDto>{
        const period = this.resolvePeriod(dto);
        const limit = Math.min(Math.max(Math.trunc(dto.limit ?? TOP_PRODUCTS_DEFAULT_LIMIT), 1), TOP_PRODUCTS_MAX_LIMIT);
        const criteria: Omit<TopSellingProductsCriteria, 'orderBy'> = {
            dateInit: period.start,
            dateFinish: period.end,
            categoryId: dto.categoryId ? BigInt(dto.categoryId) : null,
            limit,
        };

        const [byQuantity, byTotal] = await Promise.all([
            this.productRepository.findTopSellingByBranchOffice(branchOfficeId, { ...criteria, orderBy: FilterTopEnum.QUANTITY_SALES }),
            this.productRepository.findTopSellingByBranchOffice(branchOfficeId, { ...criteria, orderBy: FilterTopEnum.TOTAL_SALES }),
        ]);

        return {
            byQuantity,
            byTotal,
            dateInit: formatDay(period.start),
            dateFinish: formatDay(addDays(period.end, -1)),
        };
    }

    /**
     * Rango > mes > mes actual. En un rango, el extremo que falte se completa con el mes actual
     * (mismo criterio que FindCashSessionAllByBranchOfficeUseCase).
     */
    private resolvePeriod(dto: FilterTopRequestDTO): Period {
        // Utilizamos nuestra libreria local para fechas.
        const now = new TimeMaster('America/Mexico_City').getInstance();
        const currentMonth = monthPeriod(now.getFullYear(), now.getMonth());

        if (dto.dateInit || dto.dateFinish) {
            const start = dto.dateInit ? parseDay(dto.dateInit) : currentMonth.start;
            // El día final es inclusivo: el periodo termina al inicio del día siguiente.
            const end = dto.dateFinish ? addDays(parseDay(dto.dateFinish), 1) : currentMonth.end;
            if (start >= end) {
                throw new InvalidSalesPeriodException('La fecha de inicio no puede ser posterior a la fecha límite.');
            }
            return { start, end };
        }

        if (dto.month) {
            const [year, month] = dto.month.split('-').map(Number);
            return monthPeriod(year, month - 1);
        }

        return currentMonth;
    }
}
