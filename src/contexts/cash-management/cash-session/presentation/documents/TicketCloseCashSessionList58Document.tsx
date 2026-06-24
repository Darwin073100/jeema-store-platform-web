import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useGenerateBarcode } from '@/shared/presentation/hooks/useGenerateBarcode';
import { ICashSession } from '../interfaces/ICashSession';
import { formatDate, formatDateShort, formatDateTimeForInput } from '@/shared/lib/utils/date-formatter';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

const styles = StyleSheet.create({
  page: {
    width: mmToPt(58),
    height: '100%',                // 51mm de ancho             // 25mm de alto
    padding: mmToPt(1),                // Márgenes de 4mm
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
    width: mmToPt(50),                 // Ancho del código de barras
    height: mmToPt(4),                // Alto del código de barras
    marginBottom: 2,
  },
  barcodeValue: {
    fontSize: 10,
    fontWeight: 400,
    color: '#000000',
    textAlign: 'center',
  },
});


interface ItemProps {
  cashSesion: ICashSession
}
const ItemSession = ({ cashSesion }: ItemProps) => {
  const { generateBarcode } = useGenerateBarcode();
  const barcodeUrl = generateBarcode({
    barcode: cashSesion.cashSessionId.toString(),
    scale: 2,             // Escala de ampliación
    height: 10,           // Altura en mm
    includetext: false,
    textxalign: 'center'
  });
  return (
    <View>
      <Text style={{ fontSize: 8 }}>.......................................................................</Text>
      <View style={{ width: '100%' }}>
        <Text style={{ textAlign: 'center', fontSize: 13, width: '100%' }}>- F{cashSesion.cashSessionId.toString()}: {formatDateShort(cashSesion.startTime)} -</Text>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 10 }}>
          <Text>SUB. TOTAL: </Text>
          <Text>{numberMoneyFormat(cashSesion.expectedBalance ?? 0)}</Text>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 10 }}>
          <Text>SOBRANTE: </Text>
          <Text>{numberMoneyFormat(cashSesion.diference ?? 0)}</Text>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 10 }}>
          <Text>TOTAL: </Text>
          <Text>{numberMoneyFormat(cashSesion.actualBalance ?? 0)}</Text>
        </View>
        <View style={{ flexDirection: 'row', width: '54mm', justifyContent: 'space-between', fontSize: 10 }}>
          <Text>NOTAS: </Text>
          <Text>{cashSesion.closingNotes}</Text>
        </View>
      </View>
      <Image
        src={barcodeUrl ?? ''}
        style={styles.barcodeImage}
      />
    </View>
  )
}

interface Prop {
  cashSessions: ICashSession[],
  branchOffice: IBranchOffice | null,
}
export const TicketCloseCashSessionList58Document: React.FC<Prop> = ({ cashSessions, branchOffice }) => {
  let globalTotal = 0;
  cashSessions.forEach(item => {
    globalTotal = globalTotal + Number(item.actualBalance ?? 0);
  });
  return (
    <Document>
      <Page size={[mmToPt(58), mmToPt(2000)]} style={styles.page}>
        <Text style={{ fontSize: 12 }}>{branchOffice?.name ?? 'SUCURSAL'}</Text>
        <View style={{ width: '100%', fontSize: 8, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Text>FOLIO: {new Date().getTime()}</Text>
          <Text>FECHA: {formatDateTimeForInput(new Date())}</Text>
        </View>
        <View style={{ width: '100%', fontSize: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text>
            DIRECCION: {`${branchOffice?.address.city} ${branchOffice?.address.state}, ${branchOffice?.address.country}, ${branchOffice?.address.neighborhood}, ${branchOffice?.address.postalCode}, ${branchOffice?.address.municipality}, ${branchOffice?.address.street}`}
          </Text>
        </View>
        {/* {cashSessions.map(item => <ItemSession cashSesion={item} />)} */}
        <Text style={{ fontSize: 8 }}>.......................................................................</Text>
        <Text style={{ textAlign: 'center', fontSize: 13, width: '100%' }}>{formatDateShort(cashSessions[cashSessions.length -1].startTime)} -- {formatDateShort(cashSessions[0].startTime)}</Text>
        <Text style={{ fontSize: 8 }}>......................................................................</Text>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 12 }}>
          <Text>TOTAL</Text>
          <Text>{numberMoneyFormat(globalTotal)}</Text>
        </View>
        <Text style={{ fontSize: 8 }}>......................................................................</Text>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 6 }}>
          <Text>Sy JEEMA por Edwin Garcia Quiterio Tel: 741-107-3337</Text>
        </View>
      </Page>
    </Document>
  );
};