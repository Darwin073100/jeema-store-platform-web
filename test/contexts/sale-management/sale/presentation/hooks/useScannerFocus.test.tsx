import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { useScannerFocus } from "@/contexts/sale-management/sale/presentation/hooks/useScannerFocus";

const Harness = ({ enabled = true }: { enabled?: boolean }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useScannerFocus({ inputRef, enabled });
    return (
        <div>
            <input ref={inputRef} aria-label="escaner" />
            <button type="button" aria-label="editar">
                <svg data-testid="icono"><path data-testid="trazo" /></svg>
            </button>
            <div data-testid="fondo">fondo</div>
        </div>
    );
};

describe("useScannerFocus", () => {
    it("enfoca el input del escáner al montarse, sin desplazar la página", () => {
        const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");

        render(<Harness />);

        expect(screen.getByLabelText("escaner")).toHaveFocus();
        expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
        focusSpy.mockRestore();
    });

    it("no roba el foco al soltar el clic sobre el icono SVG de un botón", () => {
        render(<Harness />);
        const button = screen.getByLabelText("editar");
        button.focus();

        fireEvent.mouseUp(screen.getByTestId("trazo"));

        expect(button).toHaveFocus();
    });

    it("devuelve el foco al escáner al soltar el clic en una zona no interactiva", () => {
        render(<Harness />);
        screen.getByLabelText("editar").focus();

        fireEvent.mouseUp(screen.getByTestId("fondo"));

        expect(screen.getByLabelText("escaner")).toHaveFocus();
    });

    it("no actúa mientras está desactivado (modal abierto)", () => {
        render(<Harness enabled={false} />);
        const button = screen.getByLabelText("editar");
        button.focus();

        fireEvent.mouseUp(screen.getByTestId("fondo"));

        expect(button).toHaveFocus();
    });

    it("no reacciona a mousedown, para no mover el contenido a mitad del clic", () => {
        render(<Harness />);
        const button = screen.getByLabelText("editar");
        button.focus();

        fireEvent.mouseDown(screen.getByTestId("fondo"));

        expect(button).toHaveFocus();
    });
});
