'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { InventoryItemEntity } from '@/features/inventory/domain/entities/inventory-item.entity';
import { useLotStore } from '../infraestructure/store/lot.store';

const useLotActionsBar = () => {
    const [loading, setLoading] = useState(false);
    const { searchCharacter, lotsFiltered, setLotsFiltered, lots } = useLotStore();
    const [productId, setProductId] = useState('0');
    const router = useRouter();

    const handleViewProduct = (productId: string) => {
        setProductId(productId);
        router.push(`/products/${productId}`);
    };

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

    const currentProducts = lotsFiltered.map(item => {
        const base = {
            FOLIO: item.productId,
            PRODUCTO: item.product?.name ?? '',
            'CODIGO UNIVERSAL': item.product?.universalBarCode ?? '',
            'CODIGO INTERNO': item.product?.inventory?.internalBarCode ?? '',
            CATEGORIA: item.product?.category?.name ?? '',
            TEMPORADA: item.product?.season?.name ?? '',
            UNIDAD: item.product?.unitOfMeasure ?? '',
            'VENTA MENUDEO': item.product?.inventory?.salePriceOne ?? 0,
            'CANTIDAD MAYOREO': item.product?.inventory?.saleQuantityMany ?? 0,
            'VENTA MAYOREO': item.product?.inventory?.salePriceMany ?? 0,
            'FECHA REGISTRO': formatDateShort(item.createdAt),
        } as Record<string, any>;
        return base;
    });

    const handleDownloadExcel = () => {
        downloadXLSX(currentProducts, 'Productos');
    }

    return {
        handleDownloadExcel,
        newProductPage,
        totalStock,
        handleViewProduct,
        loading,
        productId,
    }
}

export { useLotActionsBar };
