import { Button } from "@/ui/components/buttons";
import { IoIosTrash } from "react-icons/io";
import { SaleDetailEntity } from "../domain/entities/sale-detail-entity";
import { numberBasicFormat } from "@/shared/lib/utils/number-formatter";
import { HiPencilSquare } from "react-icons/hi2";
import { useDeleteDetail } from "../hooks/useDeleteDetail";
import { useUpdateDetailModal } from "../hooks/useUpdateDetailModal";
import { useSale } from "../hooks/useSale";

interface Props {
    saleDetail?: SaleDetailEntity
}

const SaleDetailItem = ({ saleDetail }: Props) => {
    const { handleOpenModalDeleteDetail } = useDeleteDetail();
    const { handleLoadUpdateDetail } = useUpdateDetailModal();
    const { handleSaleTypeText } = useSale();
    return (
        <tr className="text-sm bg-white border-b dark:border-gray-700 border-gray-200 text-black">
            <th scope="row" className="px-5 py-1 font-medium whitespace-nowrap">
                {saleDetail?.productBarCodeAtSale ?? 'S/C'}
            </th>
            <td className="px-5 py-1 font-bold">
                {saleDetail?.productNameAtSale ?? 'S/N'}
            </td>
            <td className="px-5 py-1 flex justify-between items-center">
                <span>$ {numberBasicFormat(saleDetail?.unitPriceAtSale ?? 0.00)}</span>
                <span className="bg-green-100 p-1 rounded-md m-1 text-[12px] font-bold text-green-950">
                    { saleDetail? handleSaleTypeText(saleDetail?.productBarCodeAtSale ?? '',saleDetail?.quantity ?? 0) : 'N/A'}
                </span>
            </td>
            <td className="px-5 py-1 bg-blue-200 font-bold">
                {saleDetail?.quantity ?? '0.00'}
            </td>
            <td className="px-5 py-1">
                {saleDetail?.productUnitAtSale ?? 'S/P'}
            </td>
            <td className="px-5 py-1 bg-blue-200 font-bold">
                $ {numberBasicFormat(saleDetail?.subtotalItem ?? 0.00)}
            </td>
            <td className="px-2 py-1 flex justify-center gap-1">
                { saleDetail 
                    ? <>
                    <Button onClick={()=> handleLoadUpdateDetail(saleDetail)} color="yellow" title="Modifica cantidades y unidades de productos en la venta.">
                        <HiPencilSquare/>
                    </Button>
                    <Button type="button" onClick={()=> handleOpenModalDeleteDetail(saleDetail)} color="red" title="Elimina todos los productos de la venta.">
                        <IoIosTrash />
                    </Button>
                    </>
                    : null 
                }
            </td>
        </tr>
    )
}

export { SaleDetailItem };
