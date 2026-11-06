import { render, screen } from "@testing-library/react";
import { PageSkeleton } from "@/shared/ui/components/loadings/PageSkeleton";
import { TableSkeleton } from "@/shared/ui/components/loadings/TableSkeleton";

describe("TableSkeleton", () => {
    it("conserva la cabecera y genera las filas pedidas, incluyendo la columna de acciones", () => {
        render(<TableSkeleton theadList={["Folio", "Total"]} rows={3} />);

        const [header, ...bodyRows] = screen.getAllByRole("row");

        expect(header).toHaveTextContent("Folio");
        expect(header).toHaveTextContent("Acciones");
        expect(bodyRows).toHaveLength(3);
        expect(bodyRows[0].querySelectorAll("td")).toHaveLength(3);
    });

    it("no agrega la columna de acciones cuando isActions es false", () => {
        render(<TableSkeleton theadList={["Folio", "Total"]} rows={1} isActions={false} />);

        const [, bodyRow] = screen.getAllByRole("row");

        expect(bodyRow.querySelectorAll("td")).toHaveLength(2);
    });
});

describe("PageSkeleton", () => {
    it("anuncia la carga a lectores de pantalla", () => {
        render(<PageSkeleton />);

        expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
        expect(screen.getByText("Cargando...")).toBeInTheDocument();
    });
});
