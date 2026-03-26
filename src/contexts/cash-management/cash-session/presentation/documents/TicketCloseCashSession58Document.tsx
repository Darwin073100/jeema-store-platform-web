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

interface Prop {
  cashSession: ICashSession,
}
export const TicketCloseCashSession58Document: React.FC<Prop> = ({ cashSession }) => {
  const { generateBarcode } = useGenerateBarcode();
  const barcodeUrl = generateBarcode({
    barcode: cashSession.cashSessionId.toString(),
    scale: 2,             // Escala de ampliación
    height: 8,           // Altura en mm
    includetext: false,
    textxalign: 'center'
  });
  return (
    <Document>
      <Page size={[mmToPt(58), mmToPt(2000)]} style={styles.page}>
        <Text style={{ fontSize: 12 }}>{cashSession.cashRegister?.branchOffice?.name ?? 'SUCURSAL'}</Text>
        <View style={{ width: '100%', fontSize: 8, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Text>FOLIO: {new Date().getTime()}</Text>
          <Text>FECHA: {formatDateTimeForInput(new Date())}</Text>
        </View>
        <View style={{ width: '100%', fontSize: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text>
            DIRECCION: {`${cashSession.cashRegister?.branchOffice?.address.city} ${cashSession.cashRegister?.branchOffice?.address.state}, ${cashSession.cashRegister?.branchOffice?.address.country}, ${cashSession.cashRegister?.branchOffice?.address.neighborhood}, ${cashSession.cashRegister?.branchOffice?.address.postalCode}, ${cashSession.cashRegister?.branchOffice?.address.municipality}, ${cashSession.cashRegister?.branchOffice?.address.street}`}
          </Text>
          <Text>
            EMPLEADO: {`${cashSession.employee?.firstName} ${cashSession.employee?.lastName}`}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 8 }}>.......................................................................</Text>
          <Text style={{ textAlign: 'center', fontSize: 13, width: '100%' }}>{cashSession.cashRegister?.name}</Text>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 10 }}>
            <Text>FONDO: </Text>
            <Text>{numberMoneyFormat(cashSession.startBalance ?? 0)}</Text>
          </View>
          <Text style={{ fontSize: 8 }}>.......................................................................</Text>
          <View style={{ width: '100%' }}>
            <Text style={{ textAlign: 'center', fontSize: 10, width: '100%' }}>MOVIMIENTOS GENERALES</Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 8, paddingTop: 4 }}>
              <Text>SUB. TOTAL: </Text>
              <Text>{numberMoneyFormat(cashSession.expectedBalance ?? 0)}</Text>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 8, paddingTop: 4 }}>
              <Text>SOBRANTE: </Text>
              <Text>{numberMoneyFormat(cashSession.diference ?? 0)}</Text>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 8, paddingTop: 4 }}>
              <Text>TOTAL: </Text>
              <Text>{numberMoneyFormat(cashSession.actualBalance ?? 0)}</Text>
            </View>
            <View style={{ flexDirection: 'column', width: '54mm', justifyContent: 'space-between', fontSize: 8, paddingTop: 4 }}>
              <Text>NOTAS: </Text>
              <Text>{cashSession.closingNotes}</Text>
            </View>
          </View>
          <Image
            src={barcodeUrl ?? ''}
            style={styles.barcodeImage}
          />
        </View>
        <Text style={{ fontSize: 8 }}>......................................................................</Text>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 6 }}>
          <Text>Sy JEEMA por Edwin Garcia Quiterio Tel: 741-107-3337</Text>
        </View>
      </Page>
    </Document>
  );
};