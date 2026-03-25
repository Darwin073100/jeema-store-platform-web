import React, { useEffect, useState } from 'react'
import { pdf } from '@react-pdf/renderer';
import { Price27x13Document } from '../documents/Price27x13Document';
import { useProductStore } from '../stores/product.store';


const useProductPrice27x13Modal = () => {
  const { product } = useProductStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handlePrint = async () => {
      setLoading(true);
      try {

          // Generar el Blob usando el componente de React
          const doc = (
            <Price27x13Document
                priceMany={product?.inventory?.salePriceMany ?? 0}
                priceOne={product?.inventory?.salePriceOne ?? 0}
            />
          );
          const blob = await pdf(doc).toBlob();
          
          // Crear nueva URL
          setPdfUrl(URL.createObjectURL(blob));
      } catch (error) {
          setError("No se pudo cargar el documento.");
          console.error('Error generando PDF:', error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    handlePrint();
    
    // Cleanup: revocar URL cuando el componente se desmonte
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [product]);
      return {
          pdfUrl,
          loading,
          error
      }
}

export { useProductPrice27x13Modal };
