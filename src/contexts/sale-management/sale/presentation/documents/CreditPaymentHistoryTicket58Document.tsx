import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDateShort, formatTimeByDate } from "@/shared/lib/utils/date-formatter";
import { ISale } from '../interfaces/ISale';
import logo from 'src/shared/ui/assets/images/logologo.png';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';
import { EstablishmentDetailTypeEnum } from '@/contexts/establishment-management/establishment-detail/domain/enums/establishment-detail-type.enum';
import { getDetailsByType, getFirstDetailByType } from '@/contexts/establishment-management/establishment-detail/presentation/lib/get-details-by-type';
import { useGenerateBarcode } from '@/shared/ui/hooks/useGenerateBarcode';

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

// Mismo look & feel que Ticket58Document.tsx (rollo 58mm, cabezal térmico imprime ~44-48mm reales
// empezando en x=0) — se copian los mismos estilos base, solo cambia el contenido central (tabla
// de abonos en vez de productos, saldo pendiente en vez de totales de compra).
const styles = StyleSheet.create({
  page: {
    width: mmToPt(59),
    paddingLeft: mmToPt(2),
    paddingRight: mmToPt(12),
    paddingTop: mmToPt(2),
    paddingBottom: mmToPt(2),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    marginBottom: 4,
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  folio: {
    fontSize: 7,
    textAlign: 'right',
    marginBottom: 1,
  },
  fecha: {
    fontSize: 7,
    textAlign: 'right',
    marginBottom: 2,
  },
  sucursal: {
    fontSize: 7,
    textAlign: 'left',
    marginTop: 2,
    marginBottom: 1,
  },
  direccion: {
    fontSize: 7,
    textAlign: 'left',
    marginBottom: 1,
  },
  cliente: {
    fontSize: 7,
    textAlign: 'left',
    marginBottom: 1,
  },
  empleado: {
    fontSize: 7,
    textAlign: 'left',
    marginBottom: 2,
  },
  divider: {
    borderTop: '0.5 solid #000',
    marginBottom: 2,
  },
  tableHeader: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  paymentRowHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  paymentDetail: {
    fontSize: 7,
    textAlign: 'left',
    marginBottom: 1,
  },
  tableDivider: {
    fontSize: 8,
    textAlign: 'left',
    marginBottom: 1,
  },
  totalColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    marginBottom: 1,
  },
  totalBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  balanceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 3,
    marginBottom: 3,
    borderTop: '1 solid #000',
    borderBottom: '1 solid #000',
    paddingTop: 2,
    paddingBottom: 2,
  },
  contacto: {
    fontSize: 7,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 1,
  },
  facebook: {
    fontSize: 7,
    textAlign: 'center',
    marginBottom: 2,
  },
  mensaje: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  footer: {
    fontSize: 6,
    textAlign: 'center',
    marginTop: 2,
  },
  barcodeImage: {
    width: mmToPt(50),
    height: mmToPt(4),
    marginBottom: 5,
  },
});

interface Prop {
  sale: ISale;
}

export const CreditPaymentHistoryTicket58Document: React.FC<Prop> = ({ sale }) => {
  const address = `${sale.branchOffice?.address.city ?? ''} ${sale.branchOffice?.address.state ?? ''}, ${sale.branchOffice?.address.country ?? ''}, ${sale.branchOffice?.address.neighborhood ?? ''}, ${sale.branchOffice?.address.postalCode ?? ''}, ${sale.branchOffice?.address.street ?? ''}`;

  const establishmentDetails = sale.branchOffice?.establishment?.details;
  const slogan = getFirstDetailByType(establishmentDetails, EstablishmentDetailTypeEnum.SLOGAN);
  const phoneAndWhatsappValues = [
    ...getDetailsByType(establishmentDetails, EstablishmentDetailTypeEnum.PHONE_NUMBER),
    ...getDetailsByType(establishmentDetails, EstablishmentDetailTypeEnum.WHATSAPP),
  ].map((detail) => detail.value);
  const singleLineDetailTypes: { label: string; type: EstablishmentDetailTypeEnum }[] = [
    { label: 'FACEBOOK', type: EstablishmentDetailTypeEnum.FACEBOOK },
    { label: 'INSTAGRAM', type: EstablishmentDetailTypeEnum.INSTAGRAM },
    { label: 'TIKTOK', type: EstablishmentDetailTypeEnum.TIKTOK },
    { label: 'WEB', type: EstablishmentDetailTypeEnum.WEBSITE },
    { label: 'CORREO', type: EstablishmentDetailTypeEnum.EMAIL },
  ];
  const singleLineDetails = singleLineDetailTypes.reduce<{ label: string; value: string }[]>((acc, { label, type }) => {
    const detail = getFirstDetailByType(establishmentDetails, type);
    if (detail) acc.push({ label, value: detail.value });
    return acc;
  }, []);

  const salePayments = sale.salePayments ?? [];

  const sizeAdd = () => {
    const contactLinesCount = (phoneAndWhatsappValues.length > 0 ? 1 : 0) + singleLineDetails.length + (slogan ? 1 : 0);
    // Cada abono ocupa ~3 líneas (fecha/monto, empleado, método) en vez de la única línea de un
    // producto, de ahí el factor mayor respecto a Ticket58Document.
    return (mmToPt(9) * salePayments.length) + (mmToPt(3) * contactLinesCount);
  }

  const { generateBarcode } = useGenerateBarcode();
  const barcodeUrl = generateBarcode({
    barcode: sale.saleId.toString(),
    scale: 2,
    height: 8,
    includetext: false,
    textxalign: 'center'
  });

  const paymentRows = salePayments.map((p) => (
    <View key={p.salePaymentId}>
      <View style={styles.paymentRowHead}>
        <Text>{formatDateShort(p.createdAt)} {formatTimeByDate(p.createdAt)}</Text>
        <Text>{numberMoneyFormat(p.amountPaid)}</Text>
      </View>
      <Text style={styles.paymentDetail}>ATENDIÓ: {p.employee?.firstName ?? ''} {p.employee?.lastName ?? ''}</Text>
      <Text style={styles.paymentDetail}>MÉTODO: {p.paymentMethod?.name ?? 'N/A'}</Text>
      <Text style={styles.tableDivider}>---------------------------------------------------------</Text>
    </View>
  ));

  return (
    <Document>
      <Page size={[mmToPt(58), mmToPt((120 + sizeAdd()))]} style={styles.page}>
        {/* Logo */}
        <Image
          src={sale.branchOffice?.establishment?.logoUrl ?? logo.src}
          style={styles.logo}
        />

        {/* Encabezado */}
        <Text style={styles.header}>
          {sale.branchOffice?.establishment?.name.toUpperCase() ?? 'ESTABLECIMIENTO'}
        </Text>
        {slogan && <Text style={styles.subheader}>{slogan.value}</Text>}
        <Text style={styles.subheader}>HISTORIAL DE PAGOS</Text>

        {/* Folio y Fecha */}
        <Text style={styles.folio}>FOLIO VENTA: {sale.saleId}</Text>
        <Text style={styles.fecha}>EMITIDO: {formatDateShort(new Date())}: {formatTimeByDate(new Date())}</Text>

        {/* Sucursal y Dirección */}
        <Text style={styles.sucursal}>SUCURSAL: {sale.branchOffice?.name}</Text>
        <Text style={styles.direccion}>DIRECCIÓN: {address}</Text>

        {/* Cliente y Vendedor original */}
        <Text style={styles.cliente}>
          CLIENTE: {sale.customer?.firstName} {sale.customer?.lastName}
        </Text>
        <Text style={styles.empleado}>
          VENDEDOR: {sale.employee?.firstName} {sale.employee?.lastName}
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Headers de tabla */}
        <Text style={styles.tableDivider}>_________________________________________________________</Text>
        <View style={{ flexDirection: 'row', width: '100%', marginBottom: 2, justifyContent: 'space-between' }}>
          <Text style={styles.tableHeader}>FECHA / EMPLEADO / MÉTODO</Text>
          <Text style={styles.tableHeader}>MONTO</Text>
        </View>
        <Text style={styles.tableDivider}>_________________________________________________________</Text>

        {/* Abonos */}
        {paymentRows.length > 0
          ? paymentRows
          : <Text style={styles.paymentDetail}>Sin pagos registrados.</Text>}

        {/* Totales */}
        <View style={styles.totalColumn}>
          <Text style={{ width: '60%', textAlign: 'right' }}>TOTAL VENTA:</Text>
          <Text style={{ width: '40%', textAlign: 'right' }}>{numberMoneyFormat(sale.totalAmount)}</Text>
        </View>

        <View style={styles.totalBold}>
          <Text style={{ width: '60%', textAlign: 'right' }}>ABONADO:</Text>
          <Text style={{ width: '40%', textAlign: 'right' }}>{numberMoneyFormat(sale.paidAmount)}</Text>
        </View>

        {/* Saldo pendiente destacado */}
        <View style={styles.balanceBox}>
          <Text style={{ width: '60%', textAlign: 'right' }}>SALDO PENDIENTE:</Text>
          <Text style={{ width: '40%', textAlign: 'right' }}>{numberMoneyFormat(sale.balanceAmount)}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Contacto */}
        {phoneAndWhatsappValues.length > 0 && (
          <Text style={styles.contacto}>TEL: {phoneAndWhatsappValues.join(', ')}</Text>
        )}
        {singleLineDetails.map(({ label, value }) => (
          <Text key={label} style={styles.facebook}>{label}: {value}</Text>
        ))}

        {/* Mensaje final */}
        <Text style={styles.mensaje}>
          GRACIAS POR TU PREFERENCIA
        </Text>

        {/* Divider final */}
        <View style={{ borderTop: '1 solid #000', marginTop: 3, marginBottom: 3 }} />

        {/* Footer */}
        <Text style={styles.footer}>
          JEEMA Store by Edwin Garcia Quiterio{'\n'}TEL: 741-107-3337{'\n'}FACEBOOK: JEEMA Software
        </Text>
        <Image
          src={barcodeUrl ?? ''}
          style={styles.barcodeImage}
        />
      </Page>
    </Document>
  );
};
