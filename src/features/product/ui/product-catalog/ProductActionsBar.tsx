'use client';
import { useBrandStore } from '@/features/brand/infraestructure/brand.store';
import { useCategoryStore } from '@/features/category/infraestructure/category.store';
import { useSeasonStore } from '@/features/season/infraestructure/season.store';
import { Button } from '@/ui/components/buttons';
import { useRouter } from 'next/navigation';
import React from 'react'
import { IoMdAdd } from 'react-icons/io';
import { MdCategory, MdOutlineViewTimeline } from 'react-icons/md';

const ProductActionsBar = () => {
    const router = useRouter();

    const {modalOpen,setModalOpen} = useCategoryStore();
    const { modalOpen: brandModalOpen, setModalOpen: setBrandModalOpen} = useBrandStore();
    const { modalOpen: seasonModalOpen, setModalOpen: setSeasonModalOpen} = useSeasonStore();
    return (
        <div className="flex gap-2 w-[700px]">
            <Button color="blue" size="md" onClick={()=> router.push('products/new')}>
                <IoMdAdd />
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
    )
}

export { ProductActionsBar };
