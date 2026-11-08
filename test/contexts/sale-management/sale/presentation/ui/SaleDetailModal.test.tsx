import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SaleDetailModal } from "@/contexts/sale-management/sale/presentation/ui/SaleDetailModal";
import { useSaleUIStore } from "@/contexts/sale-management/sale/presentation/stores/sale.ui.store";
import { useSaleProcessStore } from "@/contexts/sale-management/sale/presentation/stores/sale.process.store";
import { useSaleStore } from "@/contexts/sale-management/sale/presentation/stores/sale.store";
import { SaleForEnum } from "@/contexts/sale-management/sale/domain/enums/sale-for.enum";
import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";
import { searchInventoryItemInformationAction } from "@/contexts/inventory-management/inventory-item/presentation/actions/search-inventory-item-information.action";
import { physicalDeleteSaleDetailAction } from "@/contexts/sale-management/sale/presentation/actions/phisical-delete-sale-detail.action";
import { findSaleWithDetailAction } from "@/contexts/sale-management/sale/presentation/actions/find-sale-by-id-with-detail.action";

// Las Server Actions cargan TypeORM: se sustituyen para probar solo la UI.
jest.mock("@/contexts/inventory-management/inventory-item/presentation/actions/search-inventory-item-information.action", () => ({
    searchInventoryItemInformationAction: jest.fn(),
}));
jest.mock("@/contexts/sale-management/sale/presentation/actions/phisical-delete-sale-detail.action", () => ({
    physicalDeleteSaleDetailAction: jest.fn(),
}));
jest.mock("@/contexts/sale-management/sale/presentation/actions/find-sale-by-id-with-detail.action", () => ({
    findSaleWithDetailAction: jest.fn(),
}));
jest.mock("@/contexts/sale-management/sale/presentation/actions/create-sale-and-add-detail.action", () => ({
    CreateSaleAndAddDetailAction: jest.fn(),
}));
jest.mock("@/contexts/inventory-management/inventory/presentation/actions/find-inventory-by-bar-code.action", () => ({
    findInventoryByBarCodeAction: jest.fn(),
}));
jest.mock("@/contexts/image-management/image/presentation/ui", () => ({ ImageThumbnail: () => null }));

const detail = {
    saleDetailId: BigInt(7),
    inventoryId: BigInt(3),
    productNameAtSale: "Coca-Cola 600 ml",
    productBarCodeAtSale: "7501055300075",
    productUnitAtSale: "PZ",
    quantity: 3,
    unitPriceAtSale: 18,
    regularPriceAtSale: 18,
    discountItem: 0,
    subtotalItem: 54,
    saleFor: SaleForEnum.ONE,
    notes: null,
    product: null,
} as unknown as ISaleDetail;

const inventoryItem = { inventory: { salePriceOne: "18.00", salePriceMany: "15.00", saleQuantityMany: "12.000" } };

const openModal = async () => {
    useSaleStore.setState({ saleId: BigInt(1) });
    useSaleProcessStore.setState({ detailSelected: detail, itemMatchDetail: null, lastTouchedDetail: null });
    act(() => {
        useSaleUIStore.setState({ saleModals: "saleDetailModal", loading: "none" });
    });
    render(<SaleDetailModal />);
    // Espera a que lleguen los precios (el skeleton desaparece).
    await screen.findByText("$15.00");
};

describe("SaleDetailModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (searchInventoryItemInformationAction as jest.Mock).mockResolvedValue({ ok: true, value: inventoryItem });
    });

    afterEach(() => {
        act(() => {
            useSaleUIStore.setState({ saleModals: "none" });
        });
    });

    it("muestra el producto con su cantidad actual", async () => {
        await openModal();

        expect(screen.getByText("Coca-Cola 600 ml")).toBeInTheDocument();
        expect(screen.getByLabelText("Cantidad")).toHaveValue(3);
    });

    it("deshabilita «Aplicar cambios» si la cantidad no cambió o es 0", async () => {
        await openModal();
        const apply = screen.getByRole("button", { name: /Aplicar cambios/ });

        expect(apply).toBeDisabled();

        fireEvent.change(screen.getByLabelText("Cantidad"), { target: { value: "0" } });
        expect(apply).toBeDisabled();
        expect(screen.getByText(/Para quitar el producto usa/)).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText("Cantidad"), { target: { value: "5" } });
        expect(apply).toBeEnabled();
    });

    it("rechaza cantidades enormes (un código escaneado por error)", async () => {
        await openModal();

        fireEvent.change(screen.getByLabelText("Cantidad"), { target: { value: "7501055300075" } });

        expect(screen.getByRole("button", { name: /Aplicar cambios/ })).toBeDisabled();
        expect(screen.getByText(/Escaneaste un código por error/)).toBeInTheDocument();
    });

    it("pide confirmación antes de eliminar y «Volver» regresa a la edición", async () => {
        await openModal();

        fireEvent.click(screen.getByRole("button", { name: /Eliminar de la venta/ }));

        expect(screen.getByText(/de la venta\?/)).toBeInTheDocument();
        expect(physicalDeleteSaleDetailAction).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole("button", { name: "Volver" }));

        expect(screen.getByRole("button", { name: /Eliminar de la venta/ })).toBeInTheDocument();
    });

    it("elimina el producto tras confirmar y cierra el modal", async () => {
        (physicalDeleteSaleDetailAction as jest.Mock).mockResolvedValue({ ok: true, value: true });
        (findSaleWithDetailAction as jest.Mock).mockResolvedValue({ ok: true, value: { saleId: BigInt(1), saleDetails: [] } });
        await openModal();

        fireEvent.click(screen.getByRole("button", { name: /Eliminar de la venta/ }));
        fireEvent.click(screen.getByRole("button", { name: /Sí, eliminar/ }));

        await waitFor(() => expect(useSaleUIStore.getState().saleModals).toBe("none"));
        expect(physicalDeleteSaleDetailAction).toHaveBeenCalledWith(BigInt(1), BigInt(7));
    });
});
