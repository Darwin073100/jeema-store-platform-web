import { findAllProductsByEstablishmentFilterAction } from "@/contexts/product-management/product/presentation/actions/find-all-products-by-establishment-filter.action";

describe('Pruebas al server action: findAllProductsByEstablishmentFilterAction', ()=> {
    test('Debe retornar una lista de productos', async ()=> {
        const serv = await findAllProductsByEstablishmentFilterAction({product: 'papel'});
        console.log(serv);
    });
});