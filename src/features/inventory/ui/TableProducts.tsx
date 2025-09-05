'use client'
import { RoundedButton } from "@/ui/components/buttons/RoundedButton";
import { CgDetailsMore } from "react-icons/cg";
import { useMemo } from "react";
import { ProductEntity } from "@/features/product/domain/entities/product.entity";
import { useProductStore } from "@/features/product/infraestructure/stores/product.store";
import { LotEntity } from "@/features/lot/domain/entities/lot.entity";
import { useRouter } from "next/navigation";
import { InventoryEntity } from "../domain/entities/inventory.entity";

interface TableProductProps {
    productList: ProductEntity[];
}

export function TableProduct({ productList = [] }: TableProductProps) {
    const { searchCharacter } = useProductStore();
    const router = useRouter();

    // Validación temprana de props
    if (!productList || !Array.isArray(productList)) {
        return (
            <div className="w-full bg-gray-100 p-4 text-center">
                No hay productos disponibles
            </div>
        );
    }

    // Memoiza el mapeo de productos con lotes e inventario
    const productsWhitLots: ProductEntity[] = useMemo(() => {
        if (!productList || !Array.isArray(productList)) return [];
        
        return productList.flatMap((product: ProductEntity) => {
            // Verificar que el producto existe y tiene lotes
            if (!product || !product.lots || !Array.isArray(product.lots) || product.lots.length < 1) {
                return [{
                    ...product
                }];
            }
            
            return product.lots.flatMap((lot: LotEntity) => {
                // Verificar que el lote existe y tiene inventarios
                console.log(product)
                console.log(lot)
                if (!lot || !lot.inventories || !Array.isArray(lot.inventories)|| lot.inventories.length < 1) {
                    return [
                        {
                    ...product,
                    lots: [lot]
                }];
                }
                
                let finalResult = lot.inventories.map((inventory: InventoryEntity) => ({
                    ...product,
                    lots: [lot],
                    inventories: inventory
                }));
                return finalResult;
            });
        });
    }, [productList]);

    // Memoiza el filtrado por nombre
    const filteredProducts = useMemo(() => {
        if (!productsWhitLots || !Array.isArray(productsWhitLots)) return [];
        if (!searchCharacter) {
            return productsWhitLots;
        }
        
        const filtered = productsWhitLots.filter(item => 
            item && item.name && 
            item.name.toLowerCase().includes(searchCharacter.toLowerCase())
        );
        
        return filtered;
    }, [productsWhitLots, searchCharacter]);

    const handleViewProduct = (productId: string) => {
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

    const head = ['Cod. Bar. Uni.', 'Nombre', 'Stock', 'Ubi.', 'P. Com.', 'P. Uni.', 'P. May.', 'Categ.', 'Detalles'];

    return (
        <div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                <thead className="text-sm text-gray-700 uppercase bg-white">
                    <tr>
                        {head.map(item => <th scope="col" className="px-6 py-3" key={item}>{item}</th>)}
                    </tr>
                </thead>
                <tbody className="border-y border-gray-300">
                    {finalProducts.map(item => (
                        <tr className="bg-white border-b border-gray-200" key={item?.productId || Math.random()}>
                            <td className="px-6 py-4">{item?.universalBarCode || '-'}</td>
                            <td className="px-6 py-4">{item?.name || '-'}</td>
                            <td className="px-6 py-4">{item?.inventories?.inventoryItems?.[0]?.quantityOnHan || 0}</td>
                            <td className="px-6 py-4">{item?.inventories?.inventoryItems?.[0]?.location || '-'}</td>
                            <td className="px-6 py-4">${item?.lots?.[0]?.purchasePrice || '0.00'}</td>
                            <td className="px-6 py-4">${item?.inventories?.salePriceOne || '0.00'}</td>
                            <td className="px-6 py-4">${item?.inventories?.salePriceMany || '0.00'}</td>
                            <td className="px-6 py-4">{item?.category?.name || '-'}</td>
                            <td className="px-6 py-4 flex gap-2 items-center">
                                <RoundedButton 
                                    color="yellow" 
                                    onClick={() => handleViewProduct(item?.productId?.toString() || '')}
                                    title="Ver detalles del producto"
                                >
                                    <CgDetailsMore />
                                </RoundedButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!finalProducts || finalProducts.length === 0) && (
                <div className="w-full bg-gray-100 p-4">No hay productos...</div>
            )}
        </div>
    )
}