import { Button } from "@/ui/components/buttons";
import { IoIosTrash } from "react-icons/io";
import { SaleDetailEntity } from "../domain/entities/sale-detail-entity";
interface Props {
    saleDetail?: SaleDetailEntity
}

const SaleDetailItem = ({ saleDetail }: Props) => {
    return (
        <tr className="text-sm bg-white border-b dark:border-gray-700 border-gray-200 text-black">
            <th scope="row" className="px-6 py-2 font-medium whitespace-nowrap">
                {saleDetail?.productBarCodeAtSale ?? 'S/C'}
            </th>
            <td className="px-6 py-2 font-bold">
                {saleDetail?.productNameAtSale ?? 'S/N'}
            </td>
            <td className="px-6 py-2">
                $ {saleDetail?.unitPriceAtSale ?? '0.00'}
            </td>
            <td className="px-6 py-2 bg-blue-200 font-bold">
                {saleDetail?.quantity ?? '0.00'}
            </td>
            <td className="px-6 py-2">
                {saleDetail?.productUnitAtSale ?? 'S/P'}
            </td>
            <td className="px-6 py-2 bg-blue-200 font-bold">
                $ {saleDetail?.subtotalItem ?? '0.00'}
            </td>
            <td className="px-2 py-2 flex justify-center">
                <Button color="red"><IoIosTrash /></Button>
            </td>
        </tr>
    )
}

export { SaleDetailItem };
