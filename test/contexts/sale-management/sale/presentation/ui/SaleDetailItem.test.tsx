import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { SaleDetailItem } from "@/contexts/sale-management/sale/presentation/ui/SaleDetailItem";
import { SaleDetailItemMovile } from "@/contexts/sale-management/sale/presentation/ui/SaleDetailItemMovile";
import { SaleForEnum } from "@/contexts/sale-management/sale/domain/enums/sale-for.enum";
import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";

jest.mock("@/contexts/image-management/image/presentation/ui", () => ({ ImageThumbnail: () => null }));

const detail = {
    saleDetailId: BigInt(7),
    productNameAtSale: "Coca-Cola 600 ml",
    productBarCodeAtSale: "7501055300075",
    productUnitAtSale: "PZ",
    quantity: 3,
    unitPriceAtSale: 18,
    regularPriceAtSale: 18,
    discountItem: 0,
    subtotalItem: 54,
    saleFor: SaleForEnum.ONE,
    product: null,
} as unknown as ISaleDetail;

const renderRow = (onOpen = jest.fn()) => {
    render(
        <table>
            <tbody>
                <SaleDetailItem saleDetail={detail} onOpen={onOpen} />
            </tbody>
        </table>
    );
    return { onOpen, row: screen.getByRole("row") };
};

describe("SaleDetailItem", () => {
    it("abre el modal con clic derecho y evita el menú del navegador", () => {
        const { onOpen, row } = renderRow();
        const event = createEvent.contextMenu(row);

        fireEvent(row, event);

        expect(event.defaultPrevented).toBe(true);
        expect(onOpen).toHaveBeenCalledTimes(1);
        expect(onOpen).toHaveBeenCalledWith(detail);
    });

    it("abre el modal con doble clic", () => {
        const { onOpen, row } = renderRow();

        fireEvent.doubleClick(row);

        expect(onOpen).toHaveBeenCalledWith(detail);
    });

    it("abre el modal con Enter sobre la fila enfocada", () => {
        const { onOpen, row } = renderRow();

        fireEvent.keyDown(row, { key: "Enter" });

        expect(onOpen).toHaveBeenCalledWith(detail);
    });

    it("abre el modal una sola vez con el botón ⋮", () => {
        const { onOpen } = renderRow();

        fireEvent.click(screen.getByRole("button", { name: "Opciones de Coca-Cola 600 ml" }));

        expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it("ya no muestra los botones de editar y eliminar", () => {
        renderRow();

        expect(screen.getAllByRole("button")).toHaveLength(1);
    });
});

describe("SaleDetailItemMovile", () => {
    it("abre el modal al tocar la tarjeta", () => {
        const onOpen = jest.fn();
        render(<SaleDetailItemMovile saleDetail={detail} onOpen={onOpen} />);

        fireEvent.click(screen.getByText("Coca-Cola 600 ml"));

        expect(onOpen).toHaveBeenCalledWith(detail);
    });

    it("el botón ⋮ abre el modal una sola vez (no se propaga a la tarjeta)", () => {
        const onOpen = jest.fn();
        render(<SaleDetailItemMovile saleDetail={detail} onOpen={onOpen} />);

        fireEvent.click(screen.getByRole("button", { name: "Opciones de Coca-Cola 600 ml" }));

        expect(onOpen).toHaveBeenCalledTimes(1);
    });
});
