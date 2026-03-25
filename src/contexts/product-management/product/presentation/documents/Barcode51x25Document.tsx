import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useGenerateBarcode } from '@/shared/presentation/hooks/useGenerateBarcode';

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

const styles = StyleSheet.create({
  page: {
    width: mmToPt(51),                 // 51mm de ancho
    height: mmToPt(25),                // 25mm de alto
    padding: mmToPt(4),                // Márgenes de 4mm
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  productText: {
    fontSize: 5,
    fontWeight: 700,
    color: '#000000',
    marginBottom: 2,
    textAlign: 'center',
  },
  barcodeImage: {
    width: mmToPt(35),                 // Ancho del código de barras
    height: mmToPt(12),                // Alto del código de barras
    marginBottom: 4,
  },
  barcodeValue: {
    fontSize: 10,
    fontWeight: 400,
    color: '#000000',
    textAlign: 'center',
  },
});

interface BarcodeProp {
  productName: string;
  barcodeValue: string;
}

export const Barcode51x25Document: React.FC<BarcodeProp> = ({ productName, barcodeValue }) => {
  const { generateBarcode } = useGenerateBarcode();
  const barcodeUrl = generateBarcode({
    barcode: barcodeValue,
    scale: 2,             // Escala de ampliación
    height: 14,           // Altura en mm
    includetext: true,   // No incluir texto debajo del código
    textxalign: 'center',
  });
  return (
    <Document>
      <Page size={[mmToPt(51), mmToPt(25)]} style={styles.page}>
        {/* Nombre del producto */}
        <Text style={styles.productText}>{productName}</Text>

        {/* Código de barras */}
        <Image 
          src={barcodeUrl ?? ''}
          style={styles.barcodeImage}
        />

        {/* Valor del código de barras */}
        {/* <Text style={styles.barcodeValue}>{barcodeValue}</Text> */}
      </Page>
    </Document>
  );
};