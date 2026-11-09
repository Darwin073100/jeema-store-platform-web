export interface ProductsTopByBranchOfficeResponseDto{
    readonly productId: bigint,
    readonly name: string,
    readonly categoryName: string | null,
    readonly quantitySales: number,
    readonly totalSales: number
}

/**
 * Ambos rankings (por volumen y por monto) más el periodo que realmente se consultó.
 */
export interface TopProductsResponseDto {
    readonly byQuantity: ProductsTopByBranchOfficeResponseDto[];
    readonly byTotal: ProductsTopByBranchOfficeResponseDto[];
    /** Primer día del periodo, `YYYY-MM-DD`. */
    readonly dateInit: string;
    /** Último día del periodo (inclusivo), `YYYY-MM-DD`. */
    readonly dateFinish: string;
}
