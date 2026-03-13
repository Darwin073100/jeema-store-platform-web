export const ENCRYPTION_REPOSITORY = 'ENCRYPTION_REPOSITORY';

export class EncryptionRepository{
    encrypt: (value:string)=> Promise<string>;

    /**
     * @param value1 string,
     * @param value2 string,
     * @returns boolean,
     * 
     * El valor 1 es la cadena que deseas comprar.
     * El valor 2 es la cadena con la que se va a comprar la cadena del valor 1.
    */
    compare: (value1:string, value2: string)=> Promise<boolean>;
}