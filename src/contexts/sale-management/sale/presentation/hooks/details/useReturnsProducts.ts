import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { SaleDetailEntity } from '../../../../../../features/sale/domain/entities/sale-detail-entity';
import { useSaleUIStore } from '../../stores/sale.ui.store';
import { returnsProductsAction } from '@/contexts/sale-management/returns/presentation/actions/returns-products.action';
import { useReturnsStore } from '@/contexts/sale-management/returns/presentation/stores/returns.store';
import { ISaleDetail } from '@/contexts/sale-management/sale-detail/presentation/interfaces/ISaleDetail';
import { ReturnsProductsDTO } from '@/contexts/sale-management/returns/application/dtos/returns-products.dto';

const schema = yup.object().shape({
    inventoryId: yup.string()
        .nullable()
        .optional()
        .typeError('Asegurate de ingresar la información correcta.'),
    saleDetailId: yup.string()
        .nullable()
        .optional()
        .typeError('Asegurate de ingresar la información correcta.'),
    quantityReturn: yup.number()
        .required('El monto es obligatorio')
        .positive('El monto debe ser positivo')
        .typeError('Asegurate de ingresar la información correcta.'),
    amountReturn: yup.number()
        .required('El monto es obligatorio')
        .positive('El monto debe ser positivo')
        .typeError('Asegurate de ingresar la información correcta.'),
    notes: yup.string()
        .nullable()
        .optional()
        .typeError('Asegurate de ingresar la información correcta.'),
});

type FormData = yup.InferType<typeof schema>;
const useReturnsProducts = () => {
    const {selectDetail, setSelectDetail } = useReturnsStore();
    
    const {saleModals, openSaleModal, closeSaleModal, floatMessageState, setFloatMessageState, initLoading, finishLoading } = useSaleUIStore();
    
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        }
    });

    useEffect(()=>{
        const quantity = watch('quantityReturn');
        const currentAmount = quantity * (selectDetail?.unitPriceAtSale ?? 0);
        setValue('amountReturn', currentAmount);
    }, [watch('quantityReturn')]);

    useEffect(()=>{
        if(saleModals=='returnsModal'){
            reset({
                quantityReturn: 1,
                inventoryId: selectDetail?.inventoryId.toString() ?? null,
                saleDetailId: selectDetail?.saleDetailId.toString() ?? null,
            });
        }
    }, [saleModals]);

    const handleSelectDetailToReturn = (detail: ISaleDetail)=> {
        setSelectDetail(detail);
        openSaleModal('returnsModal');
    }

    const onSubmit = async (data: FormData)=> {
        initLoading('returnsLoading');
        const currentData: ReturnsProductsDTO = {
            branchOfficeId: BigInt(0),
            employeeId: BigInt(0),
            cashSessionId: BigInt(0),
            saleId: BigInt(selectDetail?.saleId ?? 0),
            products: [
                {
                    amountReturn: data.amountReturn,
                    inventoryId: BigInt(data.inventoryId ?? '0'),
                    notes: data.notes ?? null,
                    quantityReturn: data.quantityReturn,
                    saleDetailId: BigInt(data.saleDetailId ?? '0')
                }
            ]
        }

        const result = await returnsProductsAction(currentData);
        finishLoading();
        if(result.ok){
            setFloatMessageState({
                isActive: true,
                type: 'green',
                summary: 'Correcto 😁',
                description: 'La devolución se ha realizado correctamente.'
            });
            closeSaleModal();
            setTimeout(()=>{
                setFloatMessageState({});
            },2000);
        } else {
            setFloatMessageState({
                isActive: true,
                type: 'red',
                summary: `${result.error?.statusCode}: ${result.error?.error} 😢`,
                description: `${result.error?.message}`
            });
            setTimeout(()=>{
                setFloatMessageState({});
            },3000);
        }
    }
    return {
        handleSubmit,
        onSubmit,
        register,
        errors,
        handleSelectDetailToReturn
    }
}

export { useReturnsProducts };
