import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import bwipjs from "bwip-js";

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

/**
 * Genera un código de barras usando la librería 'bwip-js' (Barcode Writer in Pure JavaScript).
 * Esta librería funciona perfectamente en Node.js sin dependencias nativas.
 * @param {string} text - El valor a codificar en el código de barras (ej. "12345").
 * @returns {Promise<string>} La imagen del código de barras en formato PNG Base64.
 */
async function getBarcodeBase64(text: string): Promise<string> {
    try {
        // Generar código de barras CODE128 como PNG
        const png = await bwipjs.toBuffer({
            bcid: 'code128',   // Tipo de código de barras
            text: text,           // Datos a codificar
            scale: 2,             // Escala de ampliación
            height: 7,           // Altura en mm
            includetext: true,   // Incluir texto debajo del código
            textxoffset: 0,
        });

        // Convertir PNG a Base64
        const base64 = png.toString('base64');
        const dataUrl = `data:image/png;base64,${base64}`;

        return dataUrl;
    } catch (error) {
        console.error('Error generando código de barras:', error);
        throw error;
    }
}

const styles = StyleSheet.create({
  page: {
    width: mmToPt(90), // 90mm de ancho (3 etiquetas de 26mm + 2 gaps de 4mm)
    height: mmToPt(13), // 13mm de alto
    padding: 0,
    margin: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  labelContainer: {
    width: mmToPt(26), // 26mm por etiqueta
    height: mmToPt(13), // 13mm de alto
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 1,
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
  priceText: {
    fontSize: 7,
    fontWeight: 700,
    color: '#000000',
    lineHeight: 0.9,
  }
});

interface BarcodeProp {
  productName: string;
  barcodeValue: string;
  priceOne: number;
  priceMany: number;
}

interface PriceLabelProps {
  productName: string;
  barcodeBase64: string;
  priceOne: number;
  priceMany: number;
}

const PriceLabel: React.FC<PriceLabelProps> = ({ productName, barcodeBase64, priceOne, priceMany }) => (
  <View style={styles.labelContainer}>
    <Image 
      src={barcodeBase64}
      style={styles.barcodeImage}
    />
    <Text style={styles.priceText}>
      {numberMoneyFormat(Number(priceOne ?? 0))} Men.
    </Text>
    <Text style={styles.priceText}>
      {numberMoneyFormat(Number(priceMany ?? 0))} May.
    </Text>
  </View>
);

export const Barcode27x13Document: React.FC<BarcodeProp> = ({ productName, barcodeValue, priceOne, priceMany }) => {
  const [barcodeBase64, setBarcodeBase64] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getBarcodeBase64(barcodeValue)
      .then(setBarcodeBase64)
      .catch(err => {
        console.error('Error cargando código de barras:', err);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [barcodeValue]);

  if (loading || !barcodeBase64) {
    return (
      <Document>
        <Page size={[mmToPt(90), mmToPt(13)]} style={styles.page}>
          <View style={styles.labelContainer}>
            <Text>Generando código de barras...</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size={[mmToPt(90), mmToPt(13)]} style={styles.page}>
        {/* Etiqueta 1 */}
        <PriceLabel productName={productName} barcodeBase64={barcodeBase64} priceOne={priceOne} priceMany={priceMany} />
        
        {/* Gap */}
        <View style={styles.gap} />
        
        {/* Etiqueta 2 */}
        <PriceLabel productName={productName} barcodeBase64={barcodeBase64} priceOne={priceOne} priceMany={priceMany} />
        
        {/* Gap */}
        <View style={styles.gap} />
        
        {/* Etiqueta 3 */}
        <PriceLabel productName={productName} barcodeBase64={barcodeBase64} priceOne={priceOne} priceMany={priceMany} />
      </Page>
    </Document>
  );
};