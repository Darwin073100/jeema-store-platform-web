/**
 * RegisterEducationalCenterDto es un Data Transfer Object (DTO)
 * que define la estructura de los datos de entrada para el caso de uso
 * de registro de un establesimiento.
 *
 * Contiene solo los datos necesarios para la operación, sin lógica de negocio.
 */
export class UpdateBrandDto{
    readonly brandId: bigint; 
    readonly name: string;

    constructor(brandId: bigint, name: string){
        this.brandId = brandId;
        this.name = name;
        Object.freeze(this); // Congela el objeto para hacerlo inmutable
    }
}