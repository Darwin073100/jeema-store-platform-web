export enum BarcodeTypeEnum{
    /**
     * Esta opción elige un codigo de barra con medidas de 27mm X 13mm
     */
    BARCODE27X13 = '27x13',
    /**
     * Esta opción elige un codigo de barra con medidas de 51mm X 25mm
     */
    BARCODE51X25 = '51x25',
    /**
     * Esta opción elige un codigo de barra con medidas de 51mm X 25mm
     * donde esta incluido los precios de mayoreo y menudeo.
     */
    BARCODE51X25_PRICE = '51x25-prices',

    PRICES27X13_PRICE = '27x13-prices',
}