import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
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
            bcid: 'code128',          // Tipo de código de barras
            text: text,               // Datos a codificar
            scale: 2,                 // Escala de ampliación
            height: 14,               // Altura en mm
            includetext: false,       // No incluir texto debajo del código
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
    width: mmToPt(51),                 // 51mm de ancho
    height: mmToPt(25),                // 25mm de alto
    padding: mmToPt(4),                // Márgenes de 4mm
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productText: {
    fontSize: 8,
    fontWeight: 700,
    color: '#000000',
    marginBottom: 4,
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
        <Page size={[mmToPt(51), mmToPt(25)]} style={styles.page}>
          <Text>Generando código de barras...</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size={[mmToPt(51), mmToPt(25)]} style={styles.page}>
        {/* Nombre del producto */}
        <Text style={styles.productText}>{productName}</Text>

        {/* Código de barras */}
        <Image 
          src={barcodeBase64}
          style={styles.barcodeImage}
        />

        {/* Valor del código de barras */}
        <Text style={styles.barcodeValue}>{barcodeValue}</Text>
      </Page>
    </Document>
  );
};