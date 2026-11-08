import { act, fireEvent, renderHook } from "@testing-library/react";
import { useSaleProductList } from "@/contexts/sale-management/sale/presentation/hooks/useSaleProductList";
import { useSaleUIStore } from "@/contexts/sale-management/sale/presentation/stores/sale.ui.store";
import { useSaleProcessStore } from "@/contexts/sale-management/sale/presentation/stores/sale.process.store";
import { useSaleStore } from "@/contexts/sale-management/sale/presentation/stores/sale.store";
import { ISale } from "@/contexts/sale-management/sale/presentation/interfaces/ISale";
import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("@/shared/ui/hooks/auth/useAuth", () => ({ useWorkspace: () => ({ employee: null }) }));
jest.mock("@/contexts/sale-management/sale/presentation/actions/finish-sale.action", () => ({ finishSaleAction: jest.fn() }));

const detail = (id: number) => ({ saleDetailId: BigInt(id), productNameAtSale: `Producto ${id}` }) as ISaleDetail;

const setup = (saleDetails: ISaleDetail[]) => {
    useSaleStore.setState({ sale: { saleId: BigInt(1), saleDetails } as unknown as ISale });
    useSaleUIStore.setState({ saleModals: "none", floatMessageState: {} });
    useSaleProcessStore.setState({ detailSelected: null, lastTouchedDetail: null });
    renderHook(() => useSaleProductList({ cashSession: null }));
};

const pressF8 = () => act(() => {
    fireEvent.keyDown(window, { key: "F8" });
});

describe("useSaleProductList: atajo F8", () => {
    it("abre el último producto agregado en la sesión", () => {
        setup([detail(1), detail(2), detail(3)]);
        act(() => useSaleProcessStore.getState().setLastTouchedDetail(detail(1)));

        pressF8();

        expect(useSaleUIStore.getState().saleModals).toBe("saleDetailModal");
        expect(useSaleProcessStore.getState().detailSelected?.saleDetailId).toBe(BigInt(1));
    });

    it("sin último producto registrado (p. ej. tras recargar), abre el último de la lista", () => {
        setup([detail(1), detail(2), detail(3)]);

        pressF8();

        expect(useSaleProcessStore.getState().detailSelected?.saleDetailId).toBe(BigInt(3));
    });

    it("sin productos, avisa y no abre el modal", () => {
        setup([]);

        pressF8();

        expect(useSaleUIStore.getState().saleModals).toBe("none");
        expect(useSaleUIStore.getState().floatMessageState.description).toBe("No hay productos en la venta.");
    });

    it("con otro modal abierto no hace nada", () => {
        setup([detail(1)]);
        act(() => useSaleUIStore.setState({ saleModals: "paymentModal" }));

        pressF8();

        expect(useSaleUIStore.getState().saleModals).toBe("paymentModal");
        expect(useSaleProcessStore.getState().detailSelected).toBeNull();
    });
});
