/**
 * Filtra, arrays de cadenas de texto o arrays de objetos por propiedad
 * NOTA: Solo propiedades que sus valores sean strings
 * @param { T[] } datas 
 * @param {string} filterValue 
 * @param {string | undefined} key 
 * @returns { T[] }
 */

export function arraysFilter<T>(datas:T[], filterValue: string, key?: keyof T): T[]{
    const regex = new RegExp(filterValue, 'i');

    if(Array.isArray(datas)){
        if(datas.length === 0) return [];

        if(typeof datas[0] === 'string'){
            return datas.filter(item => regex.test(item as string)) as T[];
        } else if(typeof datas[0] === 'object' && key){
            return datas.filter(item => regex.test(String(item[key])));
        } else {
            throw new Error('No se puede filtrar el array sin especificar una "key" válida');
        }
    }  else {
        throw new Error('El parametro "datas" debe ser un array');
    }
}