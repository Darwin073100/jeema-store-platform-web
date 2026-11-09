/** @jest-environment node */
import { findAllProductsByEstablishmentFilterAction } from "@/contexts/product-management/product/presentation/actions/find-all-products-by-establishment-filter.action";

// Usa la BD real de DATABASE_URL: solo corre con RUN_DB_TESTS=true (ver AGENTS.md, "Tests").
const describeDb = process.env.RUN_DB_TESTS === 'true' ? describe : describe.skip;

describeDb('Pruebas al server action: findAllProductsByEstablishmentFilterAction', ()=> {
    test('Debe retornar una lista de productos', async ()=> {
        const serv = await findAllProductsByEstablishmentFilterAction({product: 'papel'});
        expect(Array.isArray(serv)).toBe(true);
    });
});