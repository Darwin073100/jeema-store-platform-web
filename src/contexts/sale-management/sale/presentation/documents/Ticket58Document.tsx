import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate } from "@/shared/lib/utils/date-formatter";
import { ISale } from '../interfaces/ISale';
import logo from 'src/shared/ui/assets/images/la_bonita_1.png';
import { numberMoneyFormat } from '@/shared/lib/utils/number-formatter';

// Conversión de mm a puntos de PDF (1mm = 2.83465 pts)
const mmToPt = (mm: number) => mm * 2.83465;

const styles = StyleSheet.create({
  page: {
    width: mmToPt(58),
    padding: mmToPt(2),
    paddingLeft: mmToPt(2),
    paddingRight: mmToPt(2),
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
  productName: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 1,
  },
  productDetail: {
    fontSize: 7,
    textAlign: 'left',
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
    marginTop: 5,
  },
});

interface Prop {
  sale: ISale;
}

export const Ticket58Document: React.FC<Prop> = ({ sale }) => {
  const address = `${sale.branchOffice?.address.city ?? ''} ${sale.branchOffice?.address.state ?? ''}, ${sale.branchOffice?.address.country ?? ''}, ${sale.branchOffice?.address.neighborhood ?? ''}, ${sale.branchOffice?.address.postalCode ?? ''}, ${sale.branchOffice?.address.street ?? ''}`;
  const sizeAdd = ()=> {
    return mmToPt(3) * sale.saleDetails.length;
  }
  const productRows = sale.saleDetails ? sale.saleDetails.map((item) => (
    <View key={item.saleDetailId}>
      <Text style={styles.productName}>{item.productNameAtSale}</Text>
      <View style={{ flexDirection: 'row', width: '100%', marginBottom: 1 }}>
        <Text style={{ ...styles.productDetail, width: '15%' }}>{item.quantity}</Text>
        <Text style={{ ...styles.productDetail, width: '1%' }}></Text>
        <Text style={{ ...styles.productDetail, width: '20%' }}>{numberMoneyFormat(item.unitPriceAtSale)}</Text>
        <Text style={{ ...styles.productDetail, width: '20%' }}>-{numberMoneyFormat(item.discountItem)}</Text>
        <Text style={{ ...styles.productDetail, width: '24%' }}>{numberMoneyFormat((item.subtotalItem ?? 0) + (item.discountItem ?? 0))}</Text>
        <Text style={{ ...styles.productDetail, fontWeight: 'bold', width: '20%' }}>{numberMoneyFormat(item.subtotalItem)}</Text>
      </View>
      <Text style={styles.tableDivider}>---------------------------------------------------------</Text>
    </View>
  )) : [];

  return (
    <Document>
      <Page size={[mmToPt(58), mmToPt((120+sizeAdd()))]} style={styles.page}>
        {/* Logo */}
        <Image
          src={logo.src}
          style={styles.logo}
        />

        {/* Encabezado */}
        <Text style={styles.header}>
          {sale.branchOffice?.establishment?.name.toUpperCase() ?? 'ESTABLECIMIENTO'}
        </Text>
        {/* <Text style={styles.subheader}>MAYOREO Y MENUDEO</Text> */}

        {/* Folio y Fecha */}
        <Text style={styles.folio}>FOLIO: {sale.saleId}</Text>
        <Text style={styles.fecha}>FECHA: {formatDate(sale.updatedAt)}</Text>

        {/* Sucursal y Dirección */}
        <Text style={styles.sucursal}>SUCURSAL: {sale.branchOffice?.name}</Text>
        <Text style={styles.direccion}>DIRECCIÓN: {address}</Text>

        {/* Cliente y Empleado */}
        <Text style={styles.cliente}>
          CLIENTE: {sale.customer?.firstName} {sale.customer?.lastName}
        </Text>
        <Text style={styles.empleado}>
          LE ATIENDE: {sale.employee?.firstName} {sale.employee?.lastName}
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Headers de tabla */}
        <Text style={styles.tableDivider}>_________________________________________________________</Text>
        <View style={{ flexDirection: 'row', width: '100%', marginBottom: 2 }}>
          <Text style={{ ...styles.tableHeader, width: '15%' }}>CANT.</Text>
          <Text style={{ ...styles.tableHeader, width: '1%' }}></Text>
          <Text style={{ ...styles.tableHeader, width: '20%' }}>PRECIO</Text>
          <Text style={{ ...styles.tableHeader, width: '20%' }}>DES.</Text>
          <Text style={{ ...styles.tableHeader, width: '24%' }}>S.TOTAL</Text>
          <Text style={{ ...styles.tableHeader, width: '20%' }}>TOTAL</Text>
        </View>
        <Text style={styles.tableDivider}>_________________________________________________________</Text>
        {/* Productos */}
        {productRows}

        {/* Totales */}
        <View style={styles.totalColumn}>
          <Text style={{ width: '60%', textAlign: 'right' }}>SUBTOTAL:</Text>
          <Text style={{ width: '40%', textAlign: 'right' }}>
            {numberMoneyFormat(Number(sale.subTotalAmount) + Number(sale.discountAmount))}
          </Text>
        </View>

        <View style={styles.totalColumn}>
          <Text style={{ width: '60%', textAlign: 'right' }}>DESCUENTO:</Text>
          <Text style={{ width: '40%', textAlign: 'right' }}>{numberMoneyFormat(sale.discountAmount)}</Text>
        </View>

        <View style={styles.totalBold}>
          <Text style={{ width: '60%', textAlign: 'right' }}>TOTAL:</Text>
          <Text style={{ width: '40%', textAlign: 'right' }}>{numberMoneyFormat(sale.totalAmount)}</Text>
        </View>

        <View style={styles.totalColumn}>
          <Text style={{ width: '60%', textAlign: 'right' }}>RECIBIDO:</Text>
          <Text style={{ width: '40%', textAlign: 'right' }}>{numberMoneyFormat(sale.inAmount)}</Text>
        </View>

        <View style={{ ...styles.totalColumn, marginBottom: 5 }}>
          <Text style={{ width: '60%', textAlign: 'right' }}>CAMBIO:</Text>
          <Text style={{ width: '40%', textAlign: 'right' }}>{numberMoneyFormat(sale.outAmount)}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Contacto */}
        <Text style={styles.contacto}>TEL-1: 741-150-6224, TEL-2: 741-107-3337</Text>
        <Text style={styles.facebook}>FACEBOOK: Papelería y Novedades "La Bonita"</Text>

        {/* Mensaje final */}
        <Text style={styles.mensaje}>
          GRACIAS POR TU COMPRA{'\n'}TE ESPERAMOS PRONTO
        </Text>

        {/* Divider final */}
        <View style={{ borderTop: '1 solid #000', marginTop: 5, marginBottom: 5 }} />

        {/* Footer */}
        <Text style={styles.footer}>
          Sy JEEMA por: Edwin García Quiterio, Tel: 741-107-3337
        </Text>
      </Page>
    </Document>
  );
};