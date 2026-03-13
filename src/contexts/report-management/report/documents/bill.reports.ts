import type { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
const logo: Content = {
    image: 'src/assets/images/la_bonita_1.png',
    width: 150,
}

//Fake Data
const products = [
  {id : 1, price:15.50, name:"Leche Entera", quantity:2, total:31.00},
  {id : 2, price:4.25, name:"Pan de Molde", quantity:1, total:4.25},
  {id : 3, price:22.99, name:"Queso Fresco", quantity:0.5, total:11.50},
  {id : 4, price:8.75, name:"Jugo Naranja (1L)", quantity:3, total:26.25},
  {id : 5, price:35.00, name:"Carne Molida (Kg)", quantity:1.2, total:42.00},
  {id : 6, price:6.00, name:"Huevos (docena)", quantity:1, total:6.00},
  {id : 7, price:12.90, name:"Manzanas (Kg)", quantity:0.8, total:10.32},
  {id : 8, price:18.00, name:"Cereal Desayuno", quantity:2, total:36.00},
  {id : 9, price:7.50, name:"Yogurt Natural", quantity:4, total:30.00},
  {id : 10, price:5.99, name:"Pasta Dental", quantity:1, total:5.99}
]

//? Para reutilizar estilos
const styles: StyleDictionary = {
    h1: { fontSize: 20, bold: true },
    h2: { fontSize: 16, bold: true },
    h3: { fontSize: 14, bold: true },
}

export const billReport = (): TDocumentDefinitions => {
    return {
        //ENCABEZADO
        header:{ text: 'EdCode Report', alignment: 'right', margin: [10,10] },
        //BODY
        content: [
            //Linia 1: Logotipo
            logo,
            //Linia 2: Nombre o titulo
            { text: 'Ed Code', style: 'h1'},
            //Linia 3: Direccion de la empresa
            {
                columns: [
                    {
                        text: [
                            {text: 'Ometepec, Guerrero, México,\n', style: 'h3'},
                            '41700, Barrio de la Guadalupe,\n',
                            {link: 'https://google.com', text: 'www.edcode.com'}
                        ],
                        alignment: "left"},
                    {
                        text: [
                            {text: `Folio: ${new Date().getTime()}\n`, style: 'h3'},
                            `Fécha: ${new Date().toJSON()}\n`,
                            `Fécha de la venta: ${new Date().toJSON()}\n`
                        ], 
                        alignment: "right"},
                ]
            },
            // Codigo QR
            {
                qr: 'https://google.com',
                fit: 100,
                alignment: "right",
                padding: 4
            },
            //Datos del cliente
            {
                text: [
                    {text: 'Cobrar a:\n', style: 'h3'},
                    'Edwin Garcia Quiterio\n',
                    'EdGQ S.A. de C.V.\n',
                    'BN: 7879879\n',
                ],
                alignment: "left"
            },

            // Tabla con los datos del pedido
            {
                margin:[1,10],
                layout: 'lightHorizontalLines',
                table: {
                    widths: ['auto', '*', 'auto', 'auto', 'auto'],
                    body:[
                        ['ID', 'PRODUCTO', 'PRECIO', 'CANTIDAD', 'TOTAL'],
                        ...products.map(row => [
                            row.id, row.name, `$${row.price}`, row.quantity, `$${row.total}`
                        ]),
                        [{},{},{},{},{}],
                        ['','','',{colSpan:2, rowSpan: 1, text: 'TOTAL: $1,000', alignment: 'right', style:{ background: 'black', color: 'white', bold:true}}, ''],
                    ]
                }
            }
                    
        ],
        footer:[
            {text: 'Ed Code Report', alignment: 'left' }
        ],
        // Utiliza el diccionario de estilos
        styles
    }
}