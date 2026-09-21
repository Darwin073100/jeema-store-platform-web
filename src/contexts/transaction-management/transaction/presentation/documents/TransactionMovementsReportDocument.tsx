import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDateShort, formatDateTimeForInput } from '@/shared/lib/utils/date-formatter';
import { IBranchOffice } from '@/contexts/establishment-management/branch-office/presentation/interfaces/IBranchOffice';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { ITransactionsFinancialSummary } from '../interfaces/ITransactionsFinancialSummary';

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

const styles = StyleSheet.create({
  page: {
    // El rollo mide 58mm pero el cabezal térmico solo imprime ~44-48mm reales, EMPEZANDO en el
    // borde izquierdo de la página (x=0) — el corte ocurre en una posición fija, no está centrado.
    // Por eso el margen de seguridad va casi todo del lado derecho, no repartido simétrico:
    // paddingLeft grande solo empuja el contenido hacia la línea de corte y lo empeora.
    width: mmToPt(58),
    height: '100%',
    paddingLeft: mmToPt(2),
    paddingRight: mmToPt(12),
    paddingTop: mmToPt(1),
    paddingBottom: mmToPt(1),
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
  footer: {
    fontSize: 6,
    textAlign: 'center',
    marginTop: 2,
  },
});

interface Prop {
  financialSummary: ITransactionsFinancialSummary | null,
  branchOffice: IBranchOffice | null,
  dateInit: Date | null,
  dateFinish: Date | null,
}
export const TransactionMovementsReportDocument: React.FC<Prop> = ({ financialSummary, branchOffice, dateInit, dateFinish }) => {
  const folio = new Date().getTime();
  const returnsAmount = financialSummary?.returnsAmount ?? 0;
  const totalIncomes = financialSummary?.totalIncomes ?? 0;
  const totalInvested = financialSummary?.totalInvested ?? 0;
  const profitBeforeExpenses = financialSummary?.profitBeforeExpenses ?? 0;
  const totalExpenses = financialSummary?.totalExpenses ?? 0;
  const salesCountConsidered = financialSummary?.salesCountConsidered ?? 0;
  const totalGross = financialSummary?.grossTotal ?? 0;

  return (
    <Document>
      <Page size={[mmToPt(58), mmToPt(160)]} style={styles.page}>
        <Text style={{ fontSize: 12 }}>{branchOffice?.name ?? 'SUCURSAL'}</Text>
        <View style={{ width: '100%', fontSize: 8, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Text>FOLIO: {folio}</Text>
          <Text>FECHA: {formatDateTimeForInput(new Date())}</Text>
        </View>
        <View style={{ width: '100%', fontSize: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text>
            DIRECCION: {`${branchOffice?.address.city} ${branchOffice?.address.state}, ${branchOffice?.address.country}, ${branchOffice?.address.neighborhood}, ${branchOffice?.address.postalCode}, ${branchOffice?.address.municipality}, ${branchOffice?.address.street}`}
          </Text>
        </View>
        <Text style={{ fontSize: 8 }}>.......................................................................</Text>
        <Text style={{ fontSize: 11, width: '100%', textAlign: 'center', fontWeight: 700 }}>REPORTE DE MOVIMIENTOS</Text>
        {
          dateInit && dateFinish
            ? <Text style={{ textAlign: 'center', fontSize: 13, width: '100%' }}>{formatDateShort(dateInit)} -- {formatDateShort(dateFinish)}</Text>
            : <Text style={{ textAlign: 'center', fontSize: 13, width: '100%' }}>Periodo actual</Text>
        }
        <Text style={{ fontSize: 8 }}>......................................................................</Text>
        <View style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 10 }}>
            <Text>INGRESOS: </Text>
            <Text>{numberMoneyFormat(totalIncomes+returnsAmount)}</Text>
          </View>
          {
            returnsAmount > 0 &&
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 10 }}>
              <Text>DEVUELTO: </Text>
              <Text>-{numberMoneyFormat(returnsAmount)}</Text>
            </View>
          }
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 10 }}>
            <Text>EGRESOS: </Text>
            <Text>-{numberMoneyFormat(totalExpenses)}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 8 }}>......................................................................</Text>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 10 }}>
            <Text>INVERTIDO: </Text>
            <Text>{numberMoneyFormat(totalInvested)}</Text>
          </View>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 10 }}>
            <Text>GANANCIA: </Text>
            <Text>{numberMoneyFormat(profitBeforeExpenses)}</Text>
          </View>
        <Text style={{ fontSize: 8 }}>......................................................................</Text>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', fontSize: 10,fontWeight: 700 }}>
          <Text>ING. - EGR.</Text>
          <Text>{numberMoneyFormat(totalGross)}</Text>
        </View>
        <Text style={{ fontSize: 8 }}>Ventas consideradas: {salesCountConsidered}</Text>
        <Text style={{ fontSize: 8 }}>......................................................................</Text>
        <Text style={styles.footer}>
          JEEMA Store by Edwin Garcia Quiterio{'\n'}TEL: 741-107-3337{'\n'}FACEBOOK: JEEMA Software
        </Text>
      </Page>
    </Document>
  );
};
