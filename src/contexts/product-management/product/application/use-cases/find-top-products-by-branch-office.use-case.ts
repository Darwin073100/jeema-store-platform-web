import TimeMaster from "@/shared/lib/utils/TimeMaster";
import { FilterTopEnum } from "../../domain/enums/FilterTopEnum";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { ProductsTopByBranchOfficeResponseDto } from "../dtos/products-top-by-branch-office-response.dto";
import { FilterTopRequestDTO } from "../dtos/filter-top.dto";
export class FindTopProductsByBranchOfficeUseCase{
    constructor(
        private readonly productRepository: ProductRepository
    ){}

    async execute(branchOfficeId: bigint, dto: FilterTopRequestDTO): Promise<ProductsTopByBranchOfficeResponseDto[]>{
        const filterBy = dto.filterBy ?? FilterTopEnum.QUANTITY_SALES;
        const limit = dto.limit ?? 10;

        // Utilizamos nuestra libreria local para fechas.
        const date = new TimeMaster('America/Mexico_City');

        // Por defecto, el top 10 es del mes actual — igual que FindCashSessionAllByBranchOfficeUseCase.
        let currentDateInit = date.getCurrentMonthRange().start;
        let currentDateFinish = date.getCurrentMonthRange().end;
        if (dto.dateInit) {
            currentDateInit = dto.dateInit;
        }
        if (dto.dateFinish) {
            // El input de fecha del cliente llega como medianoche del día seleccionado — sumamos un
            // día para incluir todo el día final en el rango (mismo tratamiento que
            // FindCashSessionAllByBranchOfficeUseCase).
            dto.dateFinish.setDate(dto.dateFinish.getDate() + 1);
            currentDateFinish = dto.dateFinish;
        }

        const products = await this.productRepository.findAllByBranchOffice(branchOfficeId, currentDateInit, currentDateFinish);
        const result: ProductsTopByBranchOfficeResponseDto[] = products.map(item => ({
            productId: item.productId,
            name: item.name.value,
            quantitySales: item.saleDetails?.reduce((acc, saleDetail) => acc + Number(saleDetail?.quantity), 0) ?? 0,
            totalSales: item.saleDetails?.reduce((acc, saleDetail) => acc + Number(saleDetail?.subtotalItem), 0) ?? 0
        })).sort((a, b) => b[filterBy] - a[filterBy]).slice(0, limit);
        return result;
    }
}