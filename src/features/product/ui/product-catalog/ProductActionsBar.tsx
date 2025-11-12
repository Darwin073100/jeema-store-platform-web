'use client';
import { useBrandStore } from '@/features/brand/infraestructure/brand.store';
import { useCategoryStore } from '@/features/category/infraestructure/category.store';
import { useSeasonStore } from '@/features/season/infraestructure/season.store';
import { Badge } from '@/ui/components/badges/Badge';
import { Button } from '@/ui/components/buttons';
import { Spinner } from '@/ui/components/loadings/Spinner';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoMdAdd } from 'react-icons/io';
import { MdCategory, MdOutlineViewTimeline } from 'react-icons/md';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
interface Props{
    productQuantity: number
}
const ProductActionsBar = ({ productQuantity }:Props) => {
    const [loading, setLoading] = useState(false);
    const newProductPage = ()=> {
        setLoading(true);
        router.push('products/new')
    }
    const router = useRouter();

    const {modalOpen,setModalOpen} = useCategoryStore();
    const { modalOpen: brandModalOpen, setModalOpen: setBrandModalOpen} = useBrandStore();
    const { modalOpen: seasonModalOpen, setModalOpen: setSeasonModalOpen} = useSeasonStore();
    return (
        <div className="flex justify-between gap-2">
            <div className='flex items-center gap-2'>
                <Button color="blue" size="md" onClick={()=> newProductPage()}>
                    {loading? <Spinner/>: <IoMdAdd size={14}/>}
                    Nuevo Producto
                </Button>
                <Button color="yellow" size="md" onClick={() => setModalOpen(!modalOpen)}>
                    <MdCategory />
                    Categorias
                </Button>
                <Button color="green" size="md" onClick={()=> setBrandModalOpen(!brandModalOpen)}>
                    <IoMdAdd />
                    Marcas
                </Button>
                <Button color="gray" size="md" onClick={()=> setSeasonModalOpen(!seasonModalOpen)}>
                    <MdOutlineViewTimeline />
                    Temporadas
                </Button>
            </div>
            <div className="flex gap-4 items-center justify-between">
                <div className='flex gap-4 items-center'>
                    <Button disabled={loading} color='green'>
                        <PiMicrosoftExcelLogoFill />
                        Exportar a Excel
                    </Button>
                    <div>
                        Productos<Badge>{productQuantity}</Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ProductActionsBar };
