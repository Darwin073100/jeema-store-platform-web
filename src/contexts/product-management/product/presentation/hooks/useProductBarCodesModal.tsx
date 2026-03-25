import React, { useEffect, useState } from 'react'
import { Barcode27x13Document } from '../documents/Barcode27x13Document'
import { pdf } from '@react-pdf/renderer';
import { IProduct } from '../interfaces/IProduct';

interface Props {
    product: IProduct,
}
const useProductBarCodesModal = ({ product }: Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePrint = async () => {
        setLoading(true);
        console.log(product);
        try {
            // Generar el Blob usando el componente de React
            const doc = (
                <Barcode27x13Document
                    barcode={product?.inventory?.internalBarCode ?? '0000000000000'}
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
