import { PaymentMethodEntity } from "src/contexts/sale-management/payment-method/domain/entities/payment-method-entity";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";
import { SalePaymentReferenceNumberVO } from "../value-objects/sale-payment-reference-number.vo";
import { SalePaymentAmountPaidVO } from "../value-objects/sale-payment-amount-paid.vo";

export class SalePaymentEntity {
    private readonly _salePaymentId: bigint;
    private _saleId: bigint;
    private _paymentMethodId: bigint;
    private _amountPaid: SalePaymentAmountPaidVO;
    private _referenceNumber?: SalePaymentReferenceNumberVO | null;
    private readonly _createdAt: Date;
    private _updatedAt?: Date | null;
    private _deletedAt?: Date | null;
    private _sale?: SaleEntity | null;
    private _paymentMethod?: PaymentMethodEntity | null;

    private constructor(
        salePaymentId: bigint,
        saleId: bigint,
        paymentMethodId: bigint,
        amountPaid: SalePaymentAmountPaidVO,
        createdAt: Date,
        referenceNumber?: SalePaymentReferenceNumberVO | null,
        updatedAt?: Date | null,
        deletedAt?: Date | null,
        sale?: SaleEntity | null,
        paymentMethod?: PaymentMethodEntity | null,
    ){
        this._salePaymentId = salePaymentId;
        this._saleId = saleId;
        this._paymentMethodId = paymentMethodId;
        this._amountPaid = amountPaid;
        this._referenceNumber = referenceNumber;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._sale = sale;
        this._paymentMethod = paymentMethod;
    }

    get salePaymentId(): bigint {
        return this._salePaymentId;
    }
    get saleId(): bigint {
        return this._saleId;
    }
    get paymentMethodId(): bigint {
        return this._paymentMethodId;
    }
    get amountPaid(): SalePaymentAmountPaidVO {
        return this._amountPaid;
    }
    get referenceNumber(): SalePaymentReferenceNumberVO | null | undefined {
        return this._referenceNumber;
    }
    get createdAt(): Date {
        return this._createdAt;
    }
    get updatedAt(): Date | null | undefined {
        return this._updatedAt;
    }
    get deletedAt(): Date | null | undefined {
        return this._deletedAt;
    }
    get sale(): SaleEntity | null | undefined {
        return this._sale;
    }
    get paymentMethod(): PaymentMethodEntity | null | undefined {
        return this._paymentMethod;
    }

    static create(
        saleId: bigint,
        paymentMethodId: bigint,
        amountPaid: SalePaymentAmountPaidVO,
        referenceNumber?: SalePaymentReferenceNumberVO | null,
    ){
        return new SalePaymentEntity(
            BigInt(0),
            saleId,
            paymentMethodId,
            amountPaid,
            new Date(),
            referenceNumber,
            null,
            null,
            null,
            null
        );
    }

    static reconstitute(
        salePaymentId: bigint,
        saleId: bigint,
        paymentMethodId: bigint,
        amountPaid: SalePaymentAmountPaidVO,
        createdAt: Date,
        referenceNumber?: SalePaymentReferenceNumberVO | null,
        updatedAt?: Date | null,
        deletedAt?: Date | null,
        sale?: SaleEntity | null,
        paymentMethod?: PaymentMethodEntity | null,
    ){
        return new SalePaymentEntity(
            salePaymentId,
            saleId,
            paymentMethodId,
            amountPaid,
            createdAt,
            referenceNumber,
            updatedAt,
            deletedAt,
            sale,
            paymentMethod
        );
    }
}