import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate } from "@/shared/lib/utils/date-formatter";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

const logoImg = 'src/shared/ui/assets/images/la_bonita_1.png';

const styles = StyleSheet.create({
  page: {
    width: mmToPt(58),
    padding: mmToPt(2),
    flexDirection: 'column',
    fontSize: 8,
  },
  logo: {
    width: 40,
    height: '400mm',
    marginBottom: 4,
    alignSelf: 'center',
  },
  header: {
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 2,
  },
  subheader: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 4,
  },
  section: {
    marginBottom: 3,
    fontSize: 7,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    fontWeight: 700,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 2,
    fontSize: 6.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingBottom: 1,
    marginBottom: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
  },
  tableHeaderCell: {
    fontWeight: 700,
    textAlign: 'left',
  },
  tableCell: {
    textAlign: 'left',
    fontSize: 7,
  },
  productName: {
    fontWeight: 700,
    fontSize: 7,
    marginBottom: 1,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 3,
    marginTop: 3,
  },
  totalsContainer: {
    marginBottom: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
    fontSize: 8,
  },
  totalBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
    fontSize: 9,
    fontWeight: 700,
  },
  footer: {
    textAlign: 'center',
    fontSize: 7,
    marginTop: 3,
  },
  footerBold: {
    fontWeight: 700,
    fontSize: 8,
    marginTop: 2,
    marginBottom: 2,
  },
  dottedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'dashed',
    marginBottom: 3,
    marginTop: 3,
  },
});

interface Ticket58Props {
  sale: SaleEntity;
}

export const Ticket58Document: React.FC<Ticket58Props> = ({ sale }) => {
  const addressStr = `${sale.branchOffice?.address.city ?? ''} ${sale.branchOffice?.address.state ?? ''}, ${sale.branchOffice?.address.country ?? ''}, ${sale.branchOffice?.address.neighborhood ?? ''}, ${sale.branchOffice?.address.postalCode ?? ''}, ${sale.branchOffice?.address.street ?? ''}`;
  
  return (
    <Document>
      <Page size={[mmToPt(58), 'auto']} style={styles.page}>
        {/* Logo */}
        <Image src={logoImg} style={styles.logo} />

        {/* Encabezado */}
        <Text style={styles.header}>
          {sale.branchOffice?.establishment?.name.toUpperCase() ?? 'Establecimiento'}
        </Text>
        <Text style={styles.subheader}>MAYOREO Y MENUDEO</Text>

        {/* Info de venta */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text>FOLIO: {sale.saleId}</Text>
          </View>
          <View style={styles.row}>
            <Text>FECHA: {formatDate(sale.updatedAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text>SUCURSAL: {sale.branchOffice?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text>DIRECCIÓN: {addressStr}</Text>
          </View>
          <View style={styles.row}>
            <Text>CLIENTE: {sale.customer?.firstName.value} {sale.customer?.lastName?.value}</Text>
          </View>
          <View style={styles.row}>
            <Text>LE ATIENDE: {sale.employee?.firstName} {sale.employee?.lastName}</Text>
          </View>
        </View>

        <View style={styles.line} />

        {/* Tabla de productos */}
        <View style={styles.tableHeader}>
          <Text style={{ width: '12%', textAlign: 'left' }}>CANT.</Text>
          <Text style={{ width: '28%', textAlign: 'left' }}>PRODUCTO</Text>
          <Text style={{ width: '15%', textAlign: 'right' }}>PRECIO</Text>
          <Text style={{ width: '12%', textAlign: 'right' }}>DES.</Text>
          <Text style={{ width: '16%', textAlign: 'right' }}>S.TOT</Text>
          <Text style={{ width: '17%', textAlign: 'right' }}>TOTAL</Text>
        </View>

        {sale.saleDetails?.map((item, index) => (
          <View key={index}>
            <View style={styles.tableRow}>
              <Text style={{ width: '12%', textAlign: 'left' }}>{item.quantity}</Text>
              <Text style={{ width: '28%', textAlign: 'left', fontSize: 6.5 }}>{item.productNameAtSale}</Text>
              <Text style={{ width: '15%', textAlign: 'right' }}>${item.unitPriceAtSale?.toFixed(2) ?? '0.00'}</Text>
              <Text style={{ width: '12%', textAlign: 'right' }}>${item.discountItem?.toFixed(2) ?? '0.00'}</Text>
              <Text style={{ width: '16%', textAlign: 'right' }}>${((item.subtotalItem ?? 0) + (item.discountItem ?? 0)).toFixed(2)}</Text>
              <Text style={{ width: '17%', textAlign: 'right', fontWeight: 700 }}>${item.subtotalItem?.toFixed(2) ?? '0.00'}</Text>
            </View>
          </View>
        ))}

        <View style={styles.line} />

        {/* Totales */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={{ width: '60%', textAlign: 'right' }}>SUBTOTAL:</Text>
            <Text style={{ width: '40%', textAlign: 'right' }}>${(Number(sale.subTotalAmount.toFixed(2)) + Number(sale.discountAmount.toFixed(2))).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ width: '60%', textAlign: 'right' }}>DESCUENTO:</Text>
            <Text style={{ width: '40%', textAlign: 'right' }}>${sale.discountAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalBold}>
            <Text style={{ width: '60%', textAlign: 'right' }}>TOTAL:</Text>
            <Text style={{ width: '40%', textAlign: 'right' }}>${sale.totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ width: '60%', textAlign: 'right' }}>RECIBIDO:</Text>
            <Text style={{ width: '40%', textAlign: 'right' }}>${sale.inAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ width: '60%', textAlign: 'right' }}>CAMBIO:</Text>
            <Text style={{ width: '40%', textAlign: 'right' }}>${sale.outAmount.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.line} />

        {/* Contacto */}
        <View style={styles.footer}>
          <Text>TEL-1: 741-150-6224, TEL-2: 741-107-3337</Text>
          <Text>FACEBOOK: Papelería y Novedades "La Bonita"</Text>
        </View>

        {/* Mensaje final */}
        <Text style={styles.footerBold}>
          GRACIAS POR TU COMPRA{'\n'}
          TE ESPERAMOS PRONTO
        </Text>

        <View style={styles.dottedLine} />

        {/* Firma */}
        <Text style={styles.footer}>
          Sy JEEMA por: Edwin García Quiterio, Tel: 741-107-3337
        </Text>
      </Page>
    </Document>
  );
};