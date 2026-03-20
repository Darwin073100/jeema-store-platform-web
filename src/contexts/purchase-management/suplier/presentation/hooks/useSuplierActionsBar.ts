'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { downloadXLSX } from '@/shared/lib/utils/download.excel';
import { formatDateShort } from '@/shared/lib/utils/date-formatter';
import { useSuplierStore } from '../stores/suplier.store';

const useSuplierActionsBar = () => {
    const [loading, setLoading] = useState(false);
    const { searchCharacter, supliersFiltered, setSupliersFiltered, supliers } = useSuplierStore();
    const [suplierId, setSuplierId] = useState('0');
    const router = useRouter();

    const handleSuplierDetail = (suplierId: string) => {
        setSuplierId(suplierId);
        router.push(`/products/supliers/${suplierId}`);
    };

    useEffect(() => {
        if (!supliers || !Array.isArray(supliers)) setSupliersFiltered([]);
        setSupliersFiltered(supliers);
        if (!searchCharacter) {
            setSupliersFiltered(supliers);
        }
        const filtered = supliers.filter(item =>
            item && item.name &&
            item.name.trim().toLowerCase().includes(searchCharacter.trim().toLowerCase())
        );
        setSupliersFiltered([...new Set([...filtered])]);

    }, [searchCharacter, supliers]);

    const newSuplierPage = () => {
        setLoading(true);
        router.push('supliers/new')
    }

    const currentProducts = supliersFiltered.map(item => {
        const base = {
            FOLIO: item.suplierId,
            PROVEEDOR: item.name ?? '',
            'FECHA REGISTRO': formatDateShort(item.createdAt),
        } as Record<string, any>;
        return base;
    });

    const handleDownloadExcel = () => {
        downloadXLSX(currentProducts, 'Productos');
    }

    return {
        handleDownloadExcel,
        newSuplierPage,
        handleSuplierDetail,
        loading,
        suplierId,
    }
}

export { useSuplierActionsBar };
