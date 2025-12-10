'use client';
import { useBrandStore } from '@/features/brand/infraestructure/brand.store';
import { useCategoryStore } from '@/features/category/infraestructure/category.store';
import { useSeasonStore } from '@/features/season/infraestructure/season.store';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoMdAdd } from 'react-icons/io';
import { MdCategory, MdOutlineViewTimeline } from 'react-icons/md';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { ProductEntity } from '../../domain/entities/product.entity';
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { ProductExcel } from '../../domain/excel-interfaces/product.excel';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { LocationEnum } from '@/features/inventory/domain/enums/location.enum';
interface Props{
    products: ProductEntity[]
}
const ProductActionsBar = ({ products }:Props) => {
    const [loading, setLoading] = useState(false);
    const newProductPage = ()=> {
        setLoading(true);
        router.push('products/new')
    }
    const router = useRouter();
    const currentProducts = products.map(item => {
        return {
            "FOLIO": item.productId,
            PRODUCTO: item.name ?? '',
            "CODIGO UNIVERSAL": item.universalBarCode ?? '',
            "CODIGO INTERNO": item.inventory?.internalBarCode ?? '',
            CATEGORIA: item.category?.name ?? '',
            MARCA: item.brand?.name ?? '',
            TEMPORADA: item.season?.name ?? '',
            UNIDAD: item.unitOfMeasure ?? '',
            "VENTA MENUDEO": item.inventory?.salePriceOne ?? 0,
            "CANTIDAD MAYOREO": item.inventory?.saleQuantityMany ?? 0,
            "VENTA MAYOREO": item.inventory?.salePriceMany ?? 0,
            "STOCK MIN GLOBAL": item.minStockGlobal ?? 0,
            VENTA: item.inventory?.inventoryItems?.filter(item=> item.location === LocationEnum.SALE)[0]?.quantityOnHan ?? 0,
            ALMACEN: item.inventory?.inventoryItems?.filter(item=> item.location === LocationEnum.STOCK)[0]?.quantityOnHan ?? 0,
            VIAJANDO: item.inventory?.inventoryItems?.filter(item=> item.location === LocationEnum.TRAVELING)[0]?.quantityOnHan ?? 0,
            DAÑADOS: item.inventory?.inventoryItems?.filter(item=> item.location === LocationEnum.DAMAGED)[0]?.quantityOnHan ?? 0,
            "FECHA REGISTRO": formatDateShort(item.createdAt)
        }
    });
    const handleDownloadExcel = ()=> {
        downloadXLSX(currentProducts, 'Productos');
    }

    const {modalOpen,setModalOpen} = useCategoryStore();
    const { modalOpen: brandModalOpen, setModalOpen: setBrandModalOpen} = useBrandStore();
    const { modalOpen: seasonModalOpen, setModalOpen: setSeasonModalOpen} = useSeasonStore();
    return (
        <div className="flex justify-between gap-2">
            <div className='flex items-center gap-2'>
                <Button color="blue" size="md" onClick={()=> newProductPage()}>
                    {loading? <Spinner/>: <IoMdAdd size={14}/>}
                    <span className='max-sm:hidden'>Nuevo Producto</span>
                </Button>
                <Button color="yellow" size="md" onClick={() => setModalOpen(!modalOpen)}>
                    <MdCategory />
                    <span className='max-sm:hidden'>Categorias</span>
                </Button>
                <Button color="green" size="md" onClick={()=> setBrandModalOpen(!brandModalOpen)}>
                    <IoMdAdd />
                    <span className='max-sm:hidden'>Marcas</span>
                </Button>
                <Button color="gray" size="md" onClick={()=> setSeasonModalOpen(!seasonModalOpen)}>
                    <MdOutlineViewTimeline />
                    <span className='max-sm:hidden'>Temporadas</span>
                </Button>
            </div>
            <div className="flex gap-4 items-center justify-between">
                <div className='flex gap-4 items-center'>
                    <Button disabled={loading} color='green' onClick={()=> handleDownloadExcel()}>
                        <PiMicrosoftExcelLogoFill />
                        <span className='max-md:hidden'>Exportar a Excel</span>
                    </Button>
                    <div>
                        Productos<Badge>{products.length}</Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ProductActionsBar };
