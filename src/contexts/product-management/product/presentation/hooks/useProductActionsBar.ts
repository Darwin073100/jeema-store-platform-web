'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useProductStore } from '../stores/product.store';
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { IInventoryItem } from '@/contexts/inventory-management/inventory-item/presentation/interfaces/IInventoryItem';
import { IProduct } from '@/contexts/product-management/product/presentation/interfaces/IProduct';
import { LocationEnum } from '@/contexts/inventory-management/inventory-item/domain/enums/location.enum';
import { findAllProductsByEstablishmentFilterAction } from '../actions/find-all-products-by-establishment-filter.action';

const useProductActionsBar = () => {
    const [loading, setLoading] = useState(false);
    const { searchCharacter, productsFiltered, setProductsFiltered, products, lowStock } = useProductStore();
    const [productId, setProductId] = useState('0');
    const router = useRouter();

    const handleViewProduct = (productId: string) => {
        setProductId(productId);
        router.push(`/products/${productId}`);
    };

    useEffect(() => {
        if (!products || !Array.isArray(products)) setProductsFiltered([]);
        if (!searchCharacter) {
            setProductsFiltered(products);
        }
    }, [products, lowStock]);

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(searchCharacter.trim() == '*'){
            const result = await findAllProductsByEstablishmentFilterAction({});
            setProductsFiltered(result)
        } else if (searchCharacter.trim().length === 0){
            setProductsFiltered(products);
        } else {
            const result = await findAllProductsByEstablishmentFilterAction({
                internalBarcode: searchCharacter,
                product: searchCharacter,
                category: searchCharacter,
            });
            setProductsFiltered(result)
        }
    }

    const totalStock = (items: IInventoryItem[]) => {
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
    // Determine maximum number of lots across all products so we can create fixed columns for each lot
    const maxLots = productsFiltered.reduce((max, p) => Math.max(max, (p.lots?.length ?? 0)), 0);

    const currentProducts = productsFiltered.map(item => {
        const base = {
            FOLIO: item.productId,
            PRODUCTO: item.name ?? '',
            'CODIGO UNIVERSAL': item.universalBarCode ?? '',
            'CODIGO INTERNO': item.inventory?.internalBarCode ?? '',
            CATEGORIA: item.category?.name ?? '',
            MARCA: item.brand?.name ?? '',
            TEMPORADA: item.season?.name ?? '',
            UNIDAD: item.unitOfMeasure ?? '',
            'VENTA MENUDEO': item.inventory?.salePriceOne ?? 0,
            'CANTIDAD MAYOREO': item.inventory?.saleQuantityMany ?? 0,
            'VENTA MAYOREO': item.inventory?.salePriceMany ?? 0,
            'STOCK MIN GLOBAL': item.minStockGlobal ?? 0,
            VENTA: item.inventory?.inventoryItems?.filter(it => it.location === LocationEnum.SALE)[0]?.quantityOnHan ?? 0,
            ALMACEN: item.inventory?.inventoryItems?.filter(it => it.location === LocationEnum.STOCK)[0]?.quantityOnHan ?? 0,
            VIAJANDO: item.inventory?.inventoryItems?.filter(it => it.location === LocationEnum.TRAVELING)[0]?.quantityOnHan ?? 0,
            DAÑADOS: item.inventory?.inventoryItems?.filter(it => it.location === LocationEnum.DAMAGED)[0]?.quantityOnHan ?? 0,
            'FECHA REGISTRO': formatDateShort(item.createdAt),
        } as Record<string, any>;
        for (let i = 0; i < maxLots; i++) {
            const lot = item.lots?.[i];
            base[`PRECIO COMPRA ${i + 1}`] = lot?.purchasePrice.toFixed(2) ?? '';
            base[`CANTIDAD COMPRA ${i + 1}`] = lot?.initialQuantity.toFixed(4) ?? '';
            base[`FECHA ${i + 1}`] = lot?.receivedDate ? formatDateShort(lot.receivedDate) : '';
        }

        return base;
    });

    const handleColorRow = (product: IProduct) => {
        const currentStock = totalStock(product.inventory?.inventoryItems ?? []);
        const stockMinGlobal = product.minStockGlobal;
        const stockMinBranch = product.inventory?.minStockBranch ?? 0;

        if (currentStock <= stockMinGlobal && currentStock > stockMinBranch) {
            return 'text-green-600 bg-green-100';
        }
        if (currentStock <= stockMinBranch && currentStock > 0) {
            return 'text-blue-600 bg-blue-100';
        }
        if (currentStock <= 0) {
            return 'text-red-600 bg-red-100';
        }
    }
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
        handleColorRow,
        onSubmit,
    }
}

export { useProductActionsBar };
