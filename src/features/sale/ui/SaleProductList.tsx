'use client';
import { Button } from "@/ui/components/buttons";
import { IoIosSearch, IoIosTrash } from "react-icons/io";
import { useSaleStore } from "../infraestructure/stores/sale.store";
import { SaleDetailItem } from "./SaleDetailItem";

const SaleProductList = () => {
    
    const { sale } = useSaleStore();

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
            <div className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-all">
                <table className="w-full text-left rtl:text-right">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-300 to-blue-400 text-white uppercase text-sm">
                            <th scope="col" className="px-6 py-4 font-semibold">
                                Código
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
                        { sale?.saleDetails 
                            ? sale.saleDetails.map(detail=> <SaleDetailItem key={detail.saleDetailId} saleDetail={detail}/>)
                            : <SaleDetailItem/>}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export { SaleProductList };
