export const useInventoryDescriptionInput = {
    inventoryId          : 'bigint',
    productId            : 'bigint',
    lotId                : 'bigint',
    branchOfficeId       : 'bigint',
    isSellable           : '',
    internalBarCode     : `Código de barras interno el usuario tendra que aisgnar uno o utilizar el universal. Se usa cuando el producto no tiene código de barras universal o se necesita un identificador adicional.`,
    salePriceOne        : `Precio de venta al público por unidad base. Este es el precio regular para ventas individuales o en pequeñas cantidades.`,
    salePriceMany       : `Precio especial por unidad cuando se compra en grandes cantidades. Este precio se aplicará cuando la compra supere la cantidad para mayoreo.`,
    saleQuantityMany    : `Cantidad mínima de unidades que el cliente debe comprar para acceder al precio de mayoreo.`,
    salePriceSpecial    : ``,
    minStockBranch      : `Cantidad mínima que debe mantener cada sucursal. Cuando el stock baje de este número, se generará una alerta para reabastecimiento.`,
    maxStockBranch      : `Cantidad máxima que debe mantener cada sucursal. Ayuda a optimizar el espacio y evitar exceso de inventario.`,
}
