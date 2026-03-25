import React, { useEffect, useState } from 'react'
import { IProduct } from '../interfaces/IProduct';
import { Barcode51x25Document } from '../documents/Barcode51x25Document';
import { pdf } from '@react-pdf/renderer';

interface Props {
    product: IProduct,
}
const useProductBarCodes51x25Modal = ({ product }: Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePrint = async () => {
        setLoading(true);
        try {
            // Generar el Blob usando el componente de React
            const doc = (
                <Barcode51x25Document
                    barcodeValue={product?.inventory?.internalBarCode ?? '0000000000000'}
                    productName={product?.name ?? 'PRODUCTO'}
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

export { useProductBarCodes51x25Modal };
