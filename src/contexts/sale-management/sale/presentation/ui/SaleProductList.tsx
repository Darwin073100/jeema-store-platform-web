'use client';
import { Button } from "@/shared/ui/components/buttons";
import { IoIosSearch, IoIosTrash } from "react-icons/io";
import { useSaleStore } from "../stores/sale.store";
import { SaleDetailItem } from "./SaleDetailItem";
import { DeleteDetailConfirmModal } from "./DeleteDetailConfirmModal";
import { SaleInventoryListModal } from "./SaleInventoryListModal";
import { CancelSaleConfirmModal } from "./CancelSaleConfirmModal";
import { useCancelSale } from "../hooks/useCancelSale";
import { UpdateDetailModal } from "./UpdateDetailModal";
import { useInventoryListModal } from "../hooks/useInventoryListModal";
import { SaleTicketModal } from "./SaleTicketModal";
import { SaleDetailItemMovile } from "./SaleDetailItemMovile";
import { ButtonOutLine } from "@/shared/ui/components/buttons/ButtonOutLine";
const SaleProductList = () => {

    const { sale } = useSaleStore();
    const { openSaleModal } = useInventoryListModal();
    const { handleCheckerOpenModalCancelSale } = useCancelSale();

    return (
        <section className="flex-1">
            <div className="flex gap-4 mb-4">
                <ButtonOutLine onClick={() => openSaleModal('inventoryListModal')} color="blue" size="sm" className="shadow-sm hover:shadow-md transition-all">
                    <IoIosSearch className="text-lg" />
                    <span className="max-sm:hidden">Catálogo de productos</span>
                </ButtonOutLine>
                <Button onClick={() => handleCheckerOpenModalCancelSale()} color="red" size="sm" className="shadow-sm hover:shadow-md transition-all">
                    <IoIosTrash className="text-lg" />
                    <span className="max-sm:hidden">Cancelar venta</span>
                </Button>
                <SaleTicketModal />
                <SaleInventoryListModal key='sale-inventory-items-modal' />
            </div>
            <div className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all max-xl:hidden">
                <table className="w-full text-left rtl:text-right rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-300 to-blue-400 text-white uppercase text-sm">
                            <th scope="col" className="px-2 py-4 font-semibold">
                                #
                            </th>
                            <th scope="col" className="px-2 py-4 font-semibold">
                                Código
                            </th>
                            <th scope="col" className="px-2 py-4 font-semibold">
                                Producto
                            </th>
                            <th scope="col" className="px-2 py-4 font-semibold">
                                Ud.
                            </th>
                            <th scope="col" className="px-2 py-4 font-semibold">
                                P. Regular
                            </th>
                            <th scope="col" className="px-2 py-4 font-semibold">
                                S.total
                            </th>
                            <th scope="col" className="px-2 py-4 font-semibold">
                                P. Final
                            </th>
                            <th scope="col" className="px-2 py-4 font-semibold">
                                Desc.
                            </th>
                            <th scope="col" className="px-2 py-4 font-semibold">
                                Total
                            </th>
                            <th scope="col" className="px-2 py-2">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale?.saleDetails
                            ? sale.saleDetails.map(detail => <SaleDetailItem key={detail.saleDetailId} saleDetail={detail} />)
                            : <SaleDetailItem />}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col items-center gap-4 w-full xl:hidden">
                {sale?.saleDetails?.map(item => <>
                    <SaleDetailItemMovile key={item.saleDetailId} 
                        saleDetail={item}/>
                </>)}
            </div>
            <UpdateDetailModal />
            <DeleteDetailConfirmModal />
            <CancelSaleConfirmModal />
        </section>
    )
}

export { SaleProductList };
