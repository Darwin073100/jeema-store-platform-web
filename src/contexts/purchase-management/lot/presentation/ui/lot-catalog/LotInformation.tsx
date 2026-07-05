'use client'
import { numberBasicFormat, numberMoneyFormat } from "@/shared/lib/utils/number-formatter"
import { Badge } from "@/shared/ui/components/badges/Badge"
import clsx from "clsx"
import { FcBearish, FcBullish, FcDebt } from "react-icons/fc"
import { useLotInformation } from "../../hooks/useLotInformation"

export const LotInformation = () => {
    const { totalProductsStock, totalAmountPurchase } = useLotInformation();
    return (
        <section className="w-full flex gap-4">
            <div className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex flex-col justify-center`)}>
                <div className="flex justify-center items-center">
                    <FcDebt size={20} />
                    <Badge type='green'>Inventario comprado</Badge>
                </div>
                <div className="flex gap-2 text-green-700 items-center font-bold text-xl">
                    <span>Total:</span>
                    <span>{numberBasicFormat(totalProductsStock())}</span>
                </div>
            </div>
            <div className={clsx(`p-4 rounded-2xl bg-white shadow-lg flex flex-col justify-center`)}>
                <div className="flex justify-center items-center">
                    <FcDebt size={20} />
                    <Badge type='blue'>Total de la inversión</Badge>
                </div>
                <div className="flex gap-2 text-blue-700 items-center font-bold text-xl">
                    <span>Total:</span>
                    <span>{numberMoneyFormat(totalAmountPurchase())}</span>
                </div>
            </div>
        </section>
    )
}