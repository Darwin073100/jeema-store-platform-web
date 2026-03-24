import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { numberMoneyFormat } from "@/shared/lib/utils/number-formatter";

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 2,
    paddingTop: 1,
    paddingBottom: 0,
  },
  gap: {
    width: mmToPt(4), // 4mm de gap
    height: mmToPt(13),
  },
  priceText: {
    width: '100%',
    fontSize: 9,
    fontWeight: 700,
    color: '#000000',
    lineHeight: 1.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  }
});

interface BarcodeProp {
  priceOne: number;
  priceMany: number;
}

const PriceLabel: React.FC<{ priceOne: number; priceMany: number }> = ({ priceOne, priceMany }) => (
  <View style={styles.labelContainer}>
    <Text style={styles.priceText}>
      {numberMoneyFormat(Number(priceOne ?? 0))} Men.
    </Text>
    <Text style={styles.priceText}>
      {numberMoneyFormat(Number(priceMany ?? 0))} May.
    </Text>
  </View>
);

export const Price27x13Document: React.FC<BarcodeProp> = ({ priceOne, priceMany }) => (
  <Document>
    <Page size={[mmToPt(90), mmToPt(13)]} style={styles.page}>
      {/* Etiqueta 1 */}
      <PriceLabel priceOne={priceOne} priceMany={priceMany} />
      
      {/* Gap */}
      <View style={styles.gap} />
      
      {/* Etiqueta 2 */}
      <PriceLabel priceOne={priceOne} priceMany={priceMany} />
      
      {/* Gap */}
      <View style={styles.gap} />
      
      {/* Etiqueta 3 */}
      <PriceLabel priceOne={priceOne} priceMany={priceMany} />
    </Page>
  </Document>
);