import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import BwipJs from 'bwip-js';
import { useGenerateBarcode } from '@/shared/presentation/hooks/useGenerateBarcode';

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

const styles = StyleSheet.create({
  page: {
    width: mmToPt(90), // 90mm de ancho (3 etiquetas de 26mm + 2 gaps de 4mm)
    height: mmToPt(13), // 13mm de alto
    padding: 0,
    margin: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  labelContainer: {
    width: mmToPt(26), // 26mm por etiqueta
    height: mmToPt(13), // 13mm de alto
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 2,
    paddingBottom: 0,
  },
  gap: {
    width: mmToPt(4), // 4mm de gap
    height: mmToPt(13),
  },
  barcodeImage: {
    width: mmToPt(22), // 22mm (26mm - 2mm a cada lado)
    height: mmToPt(8),
  },
});

interface BarcodeItemProp {
  barcodeUrl: string
}

const PriceLabel: React.FC<BarcodeItemProp> = ({ barcodeUrl }) => {
  return (
    <View style={styles.labelContainer}>
      <Image
        src={barcodeUrl ?? ''}
        style={styles.barcodeImage}
      />
    </View>
  );
}

interface BarcodeProp {
  barcode: string
}
export const Barcode27x13Document: React.FC<BarcodeProp> = ({ barcode }: BarcodeProp) => {
  const { generateBarcode } = useGenerateBarcode();
  const barcodeUrl = generateBarcode({
    barcode, // Valor del código
    scale: 3, // Resolución
    height: 10, // Altura del código
    includetext: true, // Mostrar texto debajo
    textxalign: 'center', // Alineación del texto
  });
  return (
    <Document>
      <Page size={[mmToPt(90), mmToPt(13)]} style={styles.page}>
        {/* Etiqueta 1 */}
        <PriceLabel barcodeUrl={barcodeUrl ?? '0'} />

        {/* Gap */}
        <View style={styles.gap} />

        {/* Etiqueta 2 */}
        <PriceLabel barcodeUrl={barcodeUrl ?? '0'} />

        {/* Gap */}
        <View style={styles.gap} />

        {/* Etiqueta 3 */}
        <PriceLabel barcodeUrl={barcodeUrl ?? '0'} />
      </Page>
    </Document>
  );
};