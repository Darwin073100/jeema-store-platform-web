/**
 * Esta función sirve para paginacion de una lista de objetos de TypeORM
 * @param { number } page 
 * @param {number} pageSize 
 * Ej: page = 1
 * Ej: pageSize = 10
 * Traerá los primeros 10 registros.
 */
export function typeormPagination(page?: number, pageSize?: number){
   return {
    skip: (page && pageSize)? (page - 1) * pageSize: undefined,
    take: (page || pageSize)? pageSize: undefined,
   }
}