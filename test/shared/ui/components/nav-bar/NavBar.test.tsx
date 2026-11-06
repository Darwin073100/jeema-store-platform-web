import { render, screen } from "@testing-library/react";
import { NavBar } from "@/shared/ui/components/nav-bar/NavBar";
import { useWorkspace } from "@/shared/ui/hooks/auth/useAuth";

jest.mock("next/navigation", () => ({
    usePathname: () => "/",
    useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/shared/ui/hooks/auth/useAuth", () => ({
    useAuth: () => ({ user: { email: "correo@jeema.mx", roles: [], permissions: [] } }),
    useWorkspace: jest.fn(),
}));
jest.mock("@/shared/ui/components/modals/LogoutModal", () => ({ LogoutModal: () => null }));

const mockWorkspace = (workspace: object) => {
    (useWorkspace as jest.Mock).mockReturnValue({
        establishment: null,
        branchOffice: null,
        employee: null,
        isLoaded: false,
        error: null,
        ...workspace,
    });
};

describe("NavBar", () => {
    it("muestra skeletons en lugar de datos mientras carga el workspace", () => {
        mockWorkspace({});

        const { container } = render(<NavBar />);

        expect(container.querySelectorAll(".animate-pulse")).toHaveLength(4);
        expect(screen.queryByText("--")).not.toBeInTheDocument();
        expect(screen.queryByText("C")).not.toBeInTheDocument();
        expect(screen.getByText("Nueva Venta")).toBeInTheDocument();
    });

    it("muestra los datos del workspace al terminar de cargar", () => {
        mockWorkspace({
            isLoaded: true,
            establishment: { name: "Tienda Centro" },
            branchOffice: { name: "Sucursal Uno" },
            employee: { firstName: "Ana" },
        });

        const { container } = render(<NavBar />);

        expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument();
        expect(screen.getByText("Tienda Centro")).toBeInTheDocument();
        expect(screen.getByText("Sucursal Uno")).toBeInTheDocument();
        expect(screen.getByText("Ana")).toBeInTheDocument();
        expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("usa los valores por defecto cuando falla la carga del workspace", () => {
        mockWorkspace({ error: "Error cargando workspace" });

        const { container } = render(<NavBar />);

        expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument();
        expect(screen.getAllByText("--")).toHaveLength(2);
        expect(screen.getByText("C")).toBeInTheDocument();
    });
});
