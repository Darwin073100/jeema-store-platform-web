import { Button } from "@/ui/components/buttons";
import { IoIosCash, IoIosPerson } from "react-icons/io";

const SaleSummary = () => {
    return (
        <section className="sticky top-4">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 w-[400px]">
                <div className="space-y-6 border-b border-gray-200 pb-6">
                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Total a pagar</span>
                        <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            $ 100.00
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Productos en venta</span>
                        <div className="text-2xl font-semibold text-blue-700">10 unidades</div>
                    </div>
                </div>

                {/* Potential Component: SaleCustomerInfo */}
                <div className="py-6 space-y-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Cliente</span>
                        <Button size="sm" className="shadow-sm hover:shadow-md transition-all">
                            <IoIosPerson className="text-lg" />
                            <span>Seleccionar</span>
                        </Button>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-medium text-blue-800">Edwin Garcia Quiterio</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Los Chegües, Guerrero, México, Azoyú, a un costado del pozo de agua.
                        </p>
                    </div>
                </div>

                <div className="pt-6">
                    <Button className="w-full justify-center py-4 shadow-md hover:shadow-lg transition-all text-lg">
                        <IoIosCash className="text-2xl" />
                        <span className="font-medium">Finalizar Venta</span>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export { SaleSummary };
