import React, { useEffect, useState } from 'react'
import { useProductUIStore } from '../infraestructure/stores/product-ui.store';
import { findBarCodeByInventoryIdAction } from '@/features/inventory/actions/find-bar-code-by-inventory-id.action';
interface Props {
    inventoryId: bigint,
}
const useProductBarCodesModal = ({ inventoryId}: Props) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      
        const { productModals } = useProductUIStore();
  
      const handlePrint = async () => {
        console.log('handlePrint');
          setLoading(true);
          try {
              if(inventoryId===BigInt(0)){
                  return;
              }
              const result = await fetch(`http://localhost:3001/api/v1/reports/barcode/inventories/${inventoryId.toString()}`);
              if (!result.ok  ) {
                  return;
              }
              const blobUrl = URL.createObjectURL(await result.blob());
              setPdfUrl(blobUrl);
          } catch (error) {
            console.log(error);
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
