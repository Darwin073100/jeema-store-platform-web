export class CashSessionDifferenceVO {
    private readonly difference: number | null;
    
    private constructor(value: number | null){
        this.difference = value;
    }

    /**
     * Método para instanciar el objeto de valor y lógica de dominio.
     * @param value 
     * @returns 
     */
    public static create(value: number | null){
        if(!value) return new CashSessionDifferenceVO(null);
        return new CashSessionDifferenceVO(value);
    }

    public get value(): number {
        return Number(this.difference);
    }
}