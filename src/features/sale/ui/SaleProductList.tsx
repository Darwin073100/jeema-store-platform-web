import { Button } from "@/ui/components/buttons";
import { IoIosSearch, IoIosTrash } from "react-icons/io";

const SaleProductList = () => {
    return (
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
    )
}

export { SaleProductList };
