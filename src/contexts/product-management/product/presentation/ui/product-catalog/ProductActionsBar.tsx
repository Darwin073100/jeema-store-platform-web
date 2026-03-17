'use client';
import { useBrandStore } from '@/contexts/product-management/brand/presentation/stores/brand.store';
import { useCategoryStore } from '@/contexts/product-management/category/presentation/stores/category.store';
import { useSeasonStore } from '@/features/season/infraestructure/season.store';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import React, { useEffect } from 'react'
import { IoMdAdd } from 'react-icons/io';
import { MdCategory, MdOutlineViewTimeline } from 'react-icons/md';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { ProductEntity } from '../../../../../../features/product/domain/entities/product.entity';
import { HideElement } from '@/features/auth/ui/HideElement';
import { useProductStore } from '../../stores/product.store';
import { useProductActionsBar } from '../../hooks/useProductActionsBar';
interface Props{
    data: ProductEntity[]
}
const ProductActionsBar = ({ data }:Props) => {
    const { productsFiltered, setProducts } = useProductStore();
    const {newProductPage, handleDownloadExcel, loading} = useProductActionsBar();
    
    useEffect(()=>{
        setProducts(data);
    },[data]);

    const {modalOpen,setModalOpen} = useCategoryStore();
    const { modalOpen: brandModalOpen, setModalOpen: setBrandModalOpen} = useBrandStore();
    const { modalOpen: seasonModalOpen, setModalOpen: setSeasonModalOpen} = useSeasonStore();
    return (
        <div className="flex justify-between gap-2">
            <div className='flex items-center gap-2'>
                <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
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
                </HideElement>
            </div>
            <div className="flex gap-4 items-center justify-between">
                <div className='flex gap-4 items-center'>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <Button disabled={loading} color='green' onClick={()=> handleDownloadExcel()}>
                            <PiMicrosoftExcelLogoFill />
                            <span className='max-md:hidden'>Exportar a Excel</span>
                        </Button>
                    </HideElement>
                    <div>
                        Productos<Badge>{productsFiltered.length}</Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ProductActionsBar };
