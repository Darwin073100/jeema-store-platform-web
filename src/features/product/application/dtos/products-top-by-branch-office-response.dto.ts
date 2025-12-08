export class ProductsTopByBranchOfficeResponseDto{
    constructor(
        public readonly productId: bigint,
        public readonly name: string,
        public readonly quantitySales: number,
        public readonly totalSales: number
    ){}
}