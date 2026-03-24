import React, { useEffect, useState } from 'react'
import { pdf } from '@react-pdf/renderer';
import { Price27x13Document } from '../documents/Price27x13Document';
interface Props {
    inventoryId: bigint,
}

interface InventoryData {
  productName: string;
  barcodeValue: string;
  priceOne: number;
  priceMany: number;
}

const useProductPrice27x13Modal = ({ inventoryId}: Props) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrint = async () => {
      setLoading(true);
      try {
          if(inventoryId===BigInt(0)){
              setLoading(false);
              return;
          }
          
        //   // Obtener datos del servidor
        //   const response = await findBarCodeByInventoryIdAction(inventoryId, BarcodeTypeEnum.PRICES27X13_PRICE);
        //   if(!response.ok || !response.value){
        //     setError("No se pudo cargar los datos.");
        //     setLoading(false);
        //     return;
        //   }

          // Extraer datos de la respuesta
          // TODO: Ajustar estructura según lo que retorna findBarCodeByInventoryIdAction
          const data: InventoryData = {
            productName: 'Producto',
            barcodeValue: '000000',
            priceOne: 0,
            priceMany: 0,
          };

          // Generar el Blob usando el componente de React
          const doc = (
            <Price27x13Document
                priceMany={50}
                priceOne={70}
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
  }, [inventoryId]);
      return {
          pdfUrl,
          loading,
          error
      }
}

export { useProductPrice27x13Modal };
