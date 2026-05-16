import { Button } from "@/shared/ui/components/buttons";
import { IoIosTrash } from "react-icons/io";
import { numberBasicFormat } from "@/shared/lib/utils/number-formatter";
import { HiPencilSquare } from "react-icons/hi2";
import { useDeleteDetail } from "../hooks/useDeleteDetail";
import { useUpdateDetailModal } from "../hooks/useUpdateDetailModal";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { SaleForEnum } from "../../domain/enums/sale-for.enum";
import { ISaleDetail } from "@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail";
import { ButtonOutLine } from "@/shared/ui/components/buttons/ButtonOutLine";
// import { useSale } from "../hooks/useSale";

interface Props {
    saleDetail?: ISaleDetail
}

const SaleDetailItem = ({ saleDetail }: Props) => {
    const { handleOpenModalDeleteDetail } = useDeleteDetail();
    const { handleLoadUpdateDetail } = useUpdateDetailModal();
    // const { } = useSale();
    return (
        <tr className="text-sm bg-white border-b dark:border-blue-600 border-gray-200 text-black">
            <td className="px-2 py-1 bg-blue-200 font-bold">
                {saleDetail?.quantity ?? '0.00'}
            </td>
            <th className="px-1 py-1 font-medium text-[12px]">
                {saleDetail?.productBarCodeAtSale ?? 'S/C'}
            </th>
            <td className="px-1 py-1 font-bold">
                {saleDetail?.productNameAtSale ?? 'S/N'}
            </td>
            <td className="px-2 py-1">
                {saleDetail?.productUnitAtSale ?? 'S/P'}
            </td>
            <td className="px-2 py-1">
                <span>$ {numberBasicFormat(saleDetail?.regularPriceAtSale ?? 0.00)}</span>
            </td>
            <td className="px-2 py-1 bg-blue-200 font-bold">
                $ {numberBasicFormat((saleDetail?.subtotalItem ?? 0.00)+(saleDetail?.discountItem ?? 0.00))}
            </td>
            <td className="px-2 py-1 flex justify-between items-center">
                <span>$ {numberBasicFormat(saleDetail?.unitPriceAtSale ?? 0.00)}</span>
                <Badge type={saleDetail?.saleFor === SaleForEnum.ONE? 'blue': saleDetail?.saleFor === SaleForEnum.MANY? 'green': 'yellow'}>
                    { saleDetail?.saleFor ?? 'N/A'}
                </Badge>
            </td>
            <td className="px-2 py-1 bg-green-200">
                $ {numberBasicFormat(saleDetail?.discountItem ?? 0.00)}
            </td>
            <td className="px-2 py-1 bg-blue-200 font-bold">
                $ {numberBasicFormat(saleDetail?.subtotalItem ?? 0.00)}
            </td>
            <td className="px-2 py-1 flex justify-center gap-1">
                { saleDetail 
                    ? <>
                    <ButtonOutLine onClick={()=> handleLoadUpdateDetail(saleDetail)} title="Modifica cantidades y unidades de productos en la venta.">
                        <HiPencilSquare/>
                    </ButtonOutLine>
                    <ButtonOutLine type="button" onClick={()=> handleOpenModalDeleteDetail(saleDetail)} color="red" title="Elimina todos los productos de la venta.">
                        <IoIosTrash />
                    </ButtonOutLine>
                    </>
                    : null 
                }
            </td>
        </tr>
    )
}

export { SaleDetailItem };
