import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useGenerateBarcode } from '@/shared/presentation/hooks/useGenerateBarcode';

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

const styles = StyleSheet.create({
  page: {
    width: mmToPt(51),                 // 51mm de ancho
    height: mmToPt(25),                // 25mm de alto
    padding: mmToPt(2),                // Márgenes de 4mm
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  productText: {
    fontSize: 8,
    fontWeight: 700,
    color: '#000000',
    marginTop: 2,
    textAlign: 'center',
  },
  barcodeImage: {
    width: mmToPt(42),                 // Ancho del código de barras
    height: mmToPt(5),                // Alto del código de barras
  },
  barcodeValue: {
    fontSize: 8,
    fontWeight: 200,
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
    scale: 8,             // Escala de ampliación
    height: 8,           // Altura en mm
    includetext: false,   // No incluir texto debajo del código
    textxalign: 'center',
  });
  return (
    <Document>
      <Page size={[mmToPt(51), mmToPt(25)]} style={styles.page}>
        {/* Nombre del producto */}

        {/* Código de barras */}
        <Image 
          src={barcodeUrl ?? ''}
          style={styles.barcodeImage}
        />
        <Text style={styles.barcodeValue}>{barcodeValue}</Text>
        <Text style={styles.productText}>{productName}</Text>
        {/* Valor del código de barras */}
        {/* <Text style={styles.barcodeValue}>{barcodeValue}</Text> */}
      </Page>
    </Document>
  );
};