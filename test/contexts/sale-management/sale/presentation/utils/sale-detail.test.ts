/** @jest-environment node */
import { findLastAddedDetail } from "@/contexts/sale-management/sale/presentation/utils/sale-detail";
import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";

const detail = (id: number) => ({ saleDetailId: BigInt(id), productNameAtSale: `Producto ${id}` }) as ISaleDetail;

describe("findLastAddedDetail", () => {
    const details = [detail(1), detail(2), detail(3)];

    it("devuelve el último producto agregado o modificado en la sesión", () => {
        expect(findLastAddedDetail(details, BigInt(1))?.saleDetailId).toBe(BigInt(1));
    });

    it("sin último producto registrado, devuelve el de mayor id (el último en llegar)", () => {
        expect(findLastAddedDetail(details, null)?.saleDetailId).toBe(BigInt(3));
    });

    it("si el último producto registrado ya se eliminó, devuelve el de mayor id", () => {
        expect(findLastAddedDetail([detail(1), detail(2)], BigInt(3))?.saleDetailId).toBe(BigInt(2));
    });

    it("devuelve null si la venta no tiene productos", () => {
        expect(findLastAddedDetail([], BigInt(1))).toBeNull();
        expect(findLastAddedDetail(null, null)).toBeNull();
    });
});
