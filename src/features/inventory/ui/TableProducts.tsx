'use client'
import { useMemo, useState } from "react";
import { ProductEntity } from "@/features/product/domain/entities/product.entity";
import { useProductStore } from "@/features/product/infraestructure/stores/product.store";
import { useRouter } from "next/navigation";
import { BasicTable, BCol, BRow, BTableEmpty } from "@/shared/ui/components/tables/BasicTable";
import { Button } from "@/shared/ui/components/buttons";
import { FiExternalLink } from "react-icons/fi";
import { InventoryItemEntity } from "../domain/entities/inventory-item.entity";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";

interface TableProductProps {
    productList: ProductEntity[];
}

export function TableProduct({ productList = [] }: TableProductProps) {
    const { searchCharacter } = useProductStore();
    const [productId, setProductId] = useState('0');
    const router = useRouter();

    // Validación temprana de props
    if (!productList || !Array.isArray(productList)) {
        return (
            <div className="w-full bg-gray-100 p-4 text-center italic">
                No hay productos disponibles
            </div>
        );
    }

    // Memoiza el filtrado por nombre
    const filteredProducts = useMemo(() => {
        if (!productList || !Array.isArray(productList)) return [];
        if (!searchCharacter) {
            return productList;
        }

        const filtered = productList.filter(item =>
            item && item.name &&
            item.name.toLowerCase().includes(searchCharacter.toLowerCase())
        );

        return filtered;
    }, [productList, searchCharacter]);

    const handleViewProduct = (productId: string) => {
        setProductId(productId);
        router.push(`/products/${productId}`);
    };

    // Debug: productos finales que se van a renderizar
    const finalProducts = filteredProducts?.filter(item => {
        // Filtrar elementos que no estén eliminados (soft delete)
        if (!item) return false;
        if (item.deletedAt) return false;
        if (item.deletedAt !== null && item.deletedAt !== undefined) return false;
        return true;
    }) || [];

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

    const head = ['Cod. Bar. Uni.', 'Nombre', 'Stock', 'P. Uni.', 'P. May.', 'Categ.'];

    return (
        <div>
            <BasicTable theadList={head} isActions={true}>
                {finalProducts.map(item => (
                    <BRow key={item?.productId || Math.random()}>
                        <BCol>{item?.universalBarCode || '-'}</BCol>
                        <BCol>{item?.name || '-'}</BCol>
                        <BCol>{totalStock(item?.inventory?.inventoryItems ?? [])}</BCol>
                        {/* <BCol>{item?.inventory?.inventoryItems?.[0]?.location || '-'}</BCol> */}
                        {/* <BCol>${item?.lots?.[0]?.purchasePrice || '0.00'}</BCol> */}
                        <BCol>${item?.inventory?.salePriceOne || '0.00'}</BCol>
                        <BCol>${item?.inventory?.salePriceMany || '0.00'}</BCol>
                        <BCol>{item?.category?.name || '-'}</BCol>
                        <BCol className="flex justify-end">
                            <Button
                                size="sm"
                                color="yellow"
                                onClick={() => handleViewProduct(item?.productId?.toString() || '')}
                                title="Ver detalles del producto"
                            >
                                {productId===item.productId.toString()
                                    ? <Spinner size={14} />
                                    :<FiExternalLink size={14} /> }
                                <span>Detalles</span>
                            </Button>
                        </BCol>
                    </BRow>
                ))}
                {(!finalProducts || finalProducts.length === 0) && (
                    <BTableEmpty colsNumber={head.length + 1} />
                )}
            </BasicTable>
        </div>
    )
}