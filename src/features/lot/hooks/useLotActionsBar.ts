'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { InventoryItemEntity } from '@/features/inventory/domain/entities/inventory-item.entity';
import { useLotStore } from '../infraestructure/store/lot.store';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { findReportsLotsAction } from '../actions/find-report-lots.action';
import { numberBasicFormat } from '@/shared/lib/utils/number-formatter';
import { useLotUIStore } from '../infraestructure/store/lot-ui.store';

const schema = yup.object().shape({
    dateInit: yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
    dateFinish: yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
}).required();

type FormData = yup.InferType<typeof schema>;

const useLotActionsBar = () => {
    const [loading, setLoading] = useState(false);
    const { searchCharacter, lotsFiltered, setLotsFiltered,setLots, lots } = useLotStore();
    const { initLoading, finishLoading } = useLotUIStore();
    const [productId, setProductId] = useState('0');
    const router = useRouter();

    const handleViewProduct = (productId: string) => {
        setProductId(productId);
        router.push(`/products/${productId}`);
    };

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        
    });

    useEffect(() => {
        if (!lots || !Array.isArray(lots)) setLotsFiltered([]);
        if (!searchCharacter) {
            setLotsFiltered(lots);
        }

        const filtered = lots.filter(item =>
            item && item.product?.name &&
            item.product.name.trim().toLowerCase().includes(searchCharacter.trim().toLowerCase())
        );
        const filteredBySuplier = lots.filter(item =>
            item && item.suplier?.name &&
            item.suplier.name.trim().toLowerCase().includes(searchCharacter.trim().toLowerCase())
        );

        setLotsFiltered([...new Set([...filtered, ...filteredBySuplier])]);

    }, [searchCharacter, lots]);

    const totalStock = (items: InventoryItemEntity[]) => {
        if (items.length <= 0) {
            return 0;
        } else {
            let total: number = 0;
            for (let i = 0; i <= items.length; i++) {
                total = total + Number(items[i]?.quantityOnHan ?? 0);
            }
            return total;
        }

    }

    const newProductPage = () => {
        setLoading(true);
        router.push('/products/new')
    }

    const onSubmit = async (info: FormData) => {
        initLoading('find-report-lots');
        const lotsResponse = await findReportsLotsAction(info.dateInit ?? null, info.dateFinish ?? null);
        finishLoading();
        if(lotsResponse.ok && lotsResponse.value){
            setLotsFiltered(lotsResponse.value.lots);
            setLots(lotsResponse.value.lots);
        }
    }

    const currentProducts = lotsFiltered.map(item => {
        const base = {
            FOLIO: item.productId,
            'FECHA REGISTRO': formatDateShort(item.receivedDate),
            CATEGORIA: item.product?.category?.name ?? '',
            PRODUCTO: item.product?.name ?? '',
            'CANTIDAD': item.initialQuantity ?? '',
            UNIDAD: item.product?.unitOfMeasure ?? '',
            'COSTO': item.purchasePrice,
            'PRECIO+PRORRATEO': item.purchasePrice,
            'VENTA MENUDEO': item.product?.inventory?.salePriceOne ?? 0,
            'VENTA MAYOREO': item.product?.inventory?.salePriceMany ?? 0,
            'CANTIDAD MAYOREO': item.product?.inventory?.saleQuantityMany ?? 0,
            '': '',
            'TOTAL DE COMPRA': item.initialQuantity*item.purchasePrice,
            'PROVEEDOR': item.suplier?.name ?? 'N/A',
        } as Record<string, any>;
        return base;
    });

    const handleDownloadExcel = () => {
        downloadXLSX(currentProducts, 'Compras');
    }

    return {
        handleDownloadExcel,
        newProductPage,
        totalStock,
        handleViewProduct,
        loading,
        productId,
        onSubmit,
        handleSubmit,
        register,
        errors,
    }
}

export { useLotActionsBar };
