import React, { useEffect, useState } from 'react'
import { Barcode27x13Document } from '../documents/Barcode27x13Document'
import { useProductStore } from '../stores/product.store';
import { pdf } from '@react-pdf/renderer';

interface Props {
    inventoryId: bigint,
}
const useProductBarCodesModal = ({ inventoryId }: Props) => {
    const { product } = useProductStore();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePrint = async () => {
        setLoading(true);
        try {
            // Generar el Blob usando el componente de React
            const doc = (
                <Barcode27x13Document
                    priceMany={product?.inventory?.salePriceMany ?? 0}
                    priceOne={product?.inventory?.salePriceOne ?? 0}
                    barcodeValue={product?.inventory?.internalBarCode ?? '0'}
                    productName={product?.name ?? 'N/A'}
                />
            );
            const blob = await pdf(doc).toBlob();

            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));
        } catch (error) {
            setError("No se pudo cargar el documento.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handlePrint();
    }, []);
    return {
        pdfUrl,
        loading,
        error
    }
}

export { useProductBarCodesModal };
