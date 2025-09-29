'use client';
import { Button } from "@/ui/components/buttons";
import { IoIosCash, IoIosPerson } from "react-icons/io";
import { numberBasicFormat } from "@/shared/lib/utils/number-formatter";
import { useSaleSummary } from "../hooks/useSaleSummary";
import { SalePaymentModal } from "./SalePaymentModal";
import { useSalePayment } from "../hooks/useSalePayment";
import { PaymentMethodEntity } from "@/features/payment-method/domain/entities/payment-method-entity";
import useTransferDataToClientNewSale from "../hooks/useTransferDataToClient";
import { FloatMessage } from "@/ui/components/messages";
import { SaleCustomerListModal } from "./SaleCustomerListModal";
import { useSaleCustomerListStore } from "../infraestructure/stores/sale.customer-list.store";
import { useCustomerSale } from "../hooks/useCustomerSale";

interface Props {
    paymentMethods: PaymentMethodEntity[]
}

const SaleSummary = ({ paymentMethods }: Props) => {
    const {} = useTransferDataToClientNewSale({methods: paymentMethods});
    const { productQuantity, total} = useSaleSummary();
    const { floatMessageState, handleCheckerOpenModalFinishSale } = useSalePayment();
    const { openModalCustomerList, customerSelected, floatMessageState: messageCustomer } = useCustomerSale();

    return (
        <section className="sticky top-4">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 w-[350px]">
                <div className="space-y-6 border-b border-gray-200 pb-6">
                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Total a pagar</span>
                        <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            $ {numberBasicFormat(total)}
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Productos en venta</span>
                        <div className="text-2xl font-semibold text-blue-700">{ numberBasicFormat(productQuantity) } unidades</div>
                    </div>
                </div>

                {/* Potential Component: SaleCustomerInfo */}
                <div className="py-6 space-y-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Cliente</span>
                        <Button onClick={()=> openModalCustomerList()} size="sm" className="shadow-sm hover:shadow-md transition-all">
                            <IoIosPerson className="text-lg" />
                            <span>Seleccionar</span>
                        </Button>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-medium text-blue-800">{`${customerSelected?.firstName} ${customerSelected?.lastName}`}</h3>
                        { customerSelected?.address
                            ? <p className="text-sm text-gray-600 mt-1">
                                    { `${customerSelected?.address?.city}, ${customerSelected?.address?.state}, ${customerSelected?.address?.country}, 
                                    ${customerSelected?.address?.municipality}, ${customerSelected?.address?.postalCode}, ${customerSelected?.address?.reference}.`}
                            </p>
                            : <p className="text-sm text-gray-600 mt-1">
                                Sin dirección
                            </p>
                        }
                    </div>
                    <SaleCustomerListModal />
                </div>

                <div className="pt-6">
                    <Button onClick={()=> handleCheckerOpenModalFinishSale()} className="w-full justify-center py-4 shadow-md hover:shadow-lg transition-all text-lg">
                        <IoIosCash className="text-2xl" />
                        <span className="font-medium">Finalizar Venta</span>
                    </Button>
                </div>
            </div>

            <SalePaymentModal />
            <FloatMessage 
                key='message-sale-summary'
                { ...floatMessageState } />
            <FloatMessage 
                key='message-sale-customer'
                { ...messageCustomer } />
        </section>
    )
}

export { SaleSummary };
