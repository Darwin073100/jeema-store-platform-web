'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useProductStore } from '../infraestructure/stores/product.store';
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { LocationEnum } from '@/features/inventory/domain/enums/location.enum';
import { InventoryItemEntity } from '@/features/inventory/domain/entities/inventory-item.entity';

const useProductActionsBar = () => {
       const [loading, setLoading] = useState(false);
    const { searchCharacter, productsFiltered, setProductsFiltered, products, setProducts } = useProductStore();
    const [productId, setProductId] = useState('0');
    const router = useRouter();

    const handleViewProduct = (productId: string) => {
        setProductId(productId);
        router.push(`/products/${productId}`);
    };

    useEffect(()=> {
        if (!products || !Array.isArray(products)) setProductsFiltered([]);
        if (!searchCharacter) {
            setProductsFiltered(products);
        }

        const filtered = products.filter(item =>
            item && item.name &&
            item.name.trim().toLowerCase().includes(searchCharacter.trim().toLowerCase())
        );
        const filteredByBarCode = products.filter(item =>
            item && item.inventory?.internalBarCode &&
            item.inventory.internalBarCode?.trim().toLowerCase().includes(searchCharacter.trim().toLowerCase())
        );
        const filteredByCategory = products.filter(item =>
            item && item.category?.name &&
            item.category.name?.trim().toLowerCase().includes(searchCharacter.trim().toLowerCase())
        );

        setProductsFiltered([...new Set([...filtered, ...filteredByBarCode, ...filteredByCategory])]);
    },[searchCharacter, products]);

    const totalStock = (items: InventoryItemEntity[])=>{
        if(items.length <= 0){
            return 0;
        } else {
            let total: number = 0;
            for(let i = 0; i <= items.length; i++){
                total = total + Number(items[i]?.quantityOnHan ?? 0);
            }
            return total;
        }

    }

    const newProductPage = ()=> {
            setLoading(true);
            router.push('products/new')
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
        const handleDownloadExcel = ()=> {
            downloadXLSX(currentProducts, 'Productos');
        }
    
  return {
    handleDownloadExcel,
    newProductPage,
    totalStock,
    handleViewProduct,
    loading,
    productId
  }
}

export { useProductActionsBar };
