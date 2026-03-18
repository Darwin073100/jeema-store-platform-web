import React, { useEffect, useState } from 'react'
import { findBarCodeByInventoryIdAction } from '@/contexts/inventory-management/inventory/presentation/actions/find-bar-code-by-inventory-id.action';
import { BarcodeTypeEnum } from '../../domain/enums/barcode-type.enum';

interface Props {
    inventoryId: bigint,
}
const useProductPrice27x13Modal = ({ inventoryId}: Props) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
  
      const handlePrint = async () => {
          setLoading(true);
          try {
              if(inventoryId===BigInt(0)){
                  return;
              }
              const response = await findBarCodeByInventoryIdAction(inventoryId, BarcodeTypeEnum.PRICES27X13_PRICE);
              if(!response.ok){
                return;
              }
              if(!response.value){
                return
              }
              const blobUrl = URL.createObjectURL(await response.value);
              setPdfUrl(blobUrl);
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

export { useProductPrice27x13Modal };
