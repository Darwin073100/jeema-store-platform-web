import React, { useEffect, useState } from 'react'
import { findBarCodeByInventoryIdAction } from '@/contexts/inventory-management/inventory/presentation/actions/find-bar-code-by-inventory-id.action';
import { BarcodeTypeEnum } from '../../domain/enums/barcode-type.enum';

interface Props {
    inventoryId: bigint,
}
const useProductBarCodes51x25Modal = ({ inventoryId}: Props) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
  
      const handlePrint = async () => {
          setLoading(true);
          try {
              if(inventoryId===BigInt(0)){
                  return;
              }
              const response = await findBarCodeByInventoryIdAction(inventoryId, BarcodeTypeEnum.BARCODE51X25);
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

export { useProductBarCodes51x25Modal };
