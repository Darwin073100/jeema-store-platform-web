import { Button } from "@/ui/components/buttons";
import { TextInput } from "@/ui/components/inputs";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader"
import { IoIosBarcode, IoIosCash, IoIosPerson, IoIosSearch, IoIosTrash, IoMdCheckmark } from "react-icons/io";

export const metadata = {
    title: 'Nueva venta'
}

const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Ventas', href: '/sale' },
    { label: 'Nueva Venta' }
];

export default function() {
    return (
        <ProtectedRoute>
            <TemplateHeader breadcrumbItems={breadcrumbItems} title="Nueva Venta" detail="Agrega productos a la venta usando el código de barras o búsqueda manual." >
                {/* Potential Component: SaleProductSearch */}
                <article className="flex gap-4 items-center w-full justify-between">
                    <section className="flex bg-gradient-to-r from-blue-600 to-blue-700 w-full items-center rounded-xl shadow-md gap-4 pl-4">
                        <IoIosBarcode className="text-white text-2xl" />
                        <TextInput
                            autoFocus
                            placeholder="Escanea o escribe el código de barras" />
                    </section>
                    <section className="flex w-1/3">
                        <Button className="w-full justify-center shadow-md hover:shadow-lg transition-all">
                            <IoMdCheckmark className="text-xl" /> 
                            <span className="flex-1">Agregar producto</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">ENTER</span>
                        </Button>
                    </section>
                </article>
                <article className="flex gap-6 items-start w-full mt-6">
                    {/* Potential Component: SaleProductList */}
                    <section className="flex-1">
                        <div className="flex gap-4 mb-4">
                            <Button color="blue" size="sm" className="shadow-sm hover:shadow-md transition-all">
                                <IoIosSearch className="text-lg" /> 
                                <span>Catálogo de productos</span>
                            </Button>
                            <Button color="red" size="sm" className="shadow-sm hover:shadow-md transition-all">
                                <IoIosTrash className="text-lg" /> 
                                <span>Cancelar venta</span>
                            </Button>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                            <table className="w-full text-left rtl:text-right">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white uppercase text-sm">
                                        <th scope="col" className="px-6 py-4 font-semibold">
                                            Cód. de barra
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-semibold">
                                            Producto
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-semibold">
                                            Precio Unit.
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-semibold">
                                            Cantidad
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-semibold">
                                            Unidad
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-semibold">
                                            Subtotal
                                        </th>
                                        <th scope="col" className="px-2 py-2">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-sm bg-white border-b dark:border-gray-700 border-gray-200 text-black">
                                        <th scope="row" className="px-6 py-2 font-medium whitespace-nowrap">
                                            LABOTT1
                                        </th>
                                        <td className="px-6 py-2 font-bold">
                                            Lapiz Bocetto 1
                                        </td>
                                        <td className="px-6 py-2">
                                            $ 5.00
                                        </td>
                                        <td className="px-6 py-2 bg-blue-200 font-bold">
                                            2.00
                                        </td>
                                        <td className="px-6 py-2">
                                            PIEZA
                                        </td>
                                        <td className="px-6 py-2 bg-blue-200 font-bold">
                                            $ 10.00
                                        </td>
                                        <td className="px-2 py-2 flex justify-center">
                                            <Button color="red"><IoIosTrash /></Button>
                                        </td>
                                    </tr>
                                    <tr className="text-sm bg-white border-b dark:border-gray-700 border-gray-200 text-black">
                                        <th scope="row" className="px-6 py-2 font-medium whitespace-nowrap">
                                            LABOTT1
                                        </th>
                                        <td className="px-6 py-2 font-bold">
                                            Lapiz Bocetto 1
                                        </td>
                                        <td className="px-6 py-2">
                                            $ 5.00
                                        </td>
                                        <td className="px-6 py-2 bg-blue-200 font-bold">
                                            2.00
                                        </td>
                                        <td className="px-6 py-2">
                                            PIEZA
                                        </td>
                                        <td className="px-6 py-2 bg-blue-200 font-bold">
                                            $ 10.00
                                        </td>
                                        <td className="px-2 py-2 flex justify-center">
                                            <Button color="red"><IoIosTrash /></Button>
                                        </td>
                                    </tr>
                                    <tr className="text-sm bg-white dark:border-gray-700 border-gray-200 text-black">
                                        <th scope="row" className="px-6 py-2 font-medium whitespace-nowrap">
                                            LABOTT1
                                        </th>
                                        <td className="px-6 py-2 font-bold">
                                            Lapiz Bocetto 1
                                        </td>
                                        <td className="px-6 py-2">
                                            $ 5.00
                                        </td>
                                        <td className="px-6 py-2 bg-blue-200 font-bold">
                                            2.00
                                        </td>
                                        <td className="px-6 py-2">
                                            PIEZA
                                        </td>
                                        <td className="px-6 py-2 bg-blue-200 font-bold">
                                            $ 10.00
                                        </td>
                                        <td className="px-2 py-2 flex justify-center">
                                            <Button color="red"><IoIosTrash /></Button>
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    </section>
                    {/* Potential Component: SaleSummary */}
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
                </article>
            </TemplateHeader>
        </ProtectedRoute>
    )
} 