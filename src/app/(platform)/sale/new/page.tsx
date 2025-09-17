import { Button } from "@/ui/components/buttons";
import { TextInput } from "@/ui/components/inputs";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute"
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader"
import { FcCheckmark } from "react-icons/fc";
import { IoIosCash, IoIosPerson, IoIosSearch, IoIosTrash, IoMdCheckmark } from "react-icons/io";

export const metadata = {
    title: 'Nueva venta'
}

const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Ventas', href: '/sale' },
    { label: 'Nueva Venta' }
];

export default function NewSale() {
    return (
        <ProtectedRoute>
            <TemplateHeader breadcrumbItems={breadcrumbItems} title="Nueva Venta" detail="Agrega productos a la venta a travez de su código de barras." >
                <article className="flex gap-4 items-center w-full justify-between">
                    <section className="flex bg-gray-400 w-full items-center rounded-xl gap-4 pl-4">
                        <span className="text-white">Código</span>
                        <TextInput
                            autoFocus
                            placeholder="Introduce un código de barras" />
                    </section>
                    <section className="flex w-1/3">
                        <Button><IoMdCheckmark className="text-xl" /> ENTER - Agregar producto</Button>
                    </section>
                </article>
                <article className="flex gap-4 items-center w-full">
                    <section>
                        <div className="flex gap-4 mb-4">
                            <Button color="blue" size="sm"><IoIosSearch /> Buscar producto</Button>
                            <Button color="red" size="sm"><IoIosTrash /> Eliminar la venta</Button>
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-left rtl:text-right">
                                <thead className="text-white uppercase bg-gray-400 ">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Cód. de barra
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Nombre del producto
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            P. Venta
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Cantidad
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Unidad
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Importe
                                        </th>
                                        <th scope="col" className="px-4 py-2">
                                            <IoIosTrash className="text-red- text-lg text-center"/>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b dark:border-gray-700 border-gray-200 text-black">
                                        <th scope="row" className="px-6 py-2 font-medium whitespace-nowrap">
                                            LABOTT1
                                        </th>
                                        <td className="px-6 py-2 font-bold">
                                            Lapiz Bocetto 1
                                        </td>
                                        <td className="px-6 py-2">
                                            $ 5.00
                                        </td>
                                        <td className="px-6 py-2 bg-green-300 font-bold">
                                            2.00
                                        </td>
                                        <td className="px-6 py-2">
                                            PIEZA
                                        </td>
                                        <td className="px-6 py-2 bg-green-300 font-bold">
                                            $ 10.00
                                        </td>
                                        <td className="px-4 py-2">
                                            <Button color="red"><IoIosTrash /></Button>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:border-gray-700 border-gray-200 text-black">
                                        <th scope="row" className="px-6 py-2 font-medium whitespace-nowrap">
                                            LABOTT1
                                        </th>
                                        <td className="px-6 py-2 font-bold">
                                            Lapiz Bocetto 1
                                        </td>
                                        <td className="px-6 py-2">
                                            $ 5.00
                                        </td>
                                        <td className="px-6 py-2 bg-green-300 font-bold">
                                            2.00
                                        </td>
                                        <td className="px-6 py-2">
                                            PIEZA
                                        </td>
                                        <td className="px-6 py-2 bg-green-300 font-bold">
                                            $ 10.00
                                        </td>
                                        <td className="px-4 py-2">
                                            <Button color="red"><IoIosTrash /></Button>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:border-gray-700 border-gray-200 text-black">
                                        <th scope="row" className="px-6 py-2 font-medium whitespace-nowrap">
                                            LABOTT1
                                        </th>
                                        <td className="px-6 py-2 font-bold">
                                            Lapiz Bocetto 1
                                        </td>
                                        <td className="px-6 py-2">
                                            $ 5.00
                                        </td>
                                        <td className="px-6 py-2 bg-green-300 font-bold">
                                            2.00
                                        </td>
                                        <td className="px-6 py-2">
                                            PIEZA
                                        </td>
                                        <td className="px-6 py-2 bg-green-300 font-bold">
                                            $ 10.00
                                        </td>
                                        <td className="px-4 py-2">
                                            <Button color="red"><IoIosTrash /></Button>
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <section>
                        <div className="bg-white rounded-xl p-4 w-[350px]">
                            <div className="border-b border-b-gray-500">
                                <div className="flex flex-col justify-between items-center">
                                    <span>Total a pagar</span>
                                    <span className="text-5xl">$ 100.00</span>
                                </div>
                                <div className="flex flex-col justify-between items-center">
                                    <span>Conteo de productos</span>
                                    <span className="text-2xl">10.00</span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between">

                                <span className="text-center">Cliente</span>
                                <div className="flex items-center">
                                    <span>Edwin Garcia Quiterio</span>
                                    <Button><IoIosPerson /></Button>
                                </div>
                                <p>Los Chegües, Guerrero, México, Azoyú, a un costado del pozo de agua.</p>
                            </div>
                            <div>
                                <Button><IoIosCash className="text-xl" />COBRAR VENTA</Button>
                            </div>
                        </div>
                    </section>
                </article>
            </TemplateHeader>
        </ProtectedRoute>
    )
} 