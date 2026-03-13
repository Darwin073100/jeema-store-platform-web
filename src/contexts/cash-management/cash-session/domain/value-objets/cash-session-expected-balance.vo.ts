export class CashSessionExpectedBalanceVO {
    private readonly expectedBalance: number | null;
    
    private constructor(value: number | null){
        this.expectedBalance = value;
    }

    /**
     * Método para instanciar el objeto de valor y lógica de dominio.
     * @param value 
     * @returns 
     */
    public static create(value: number | null){
        if(!value) return new CashSessionExpectedBalanceVO(null);
        return new CashSessionExpectedBalanceVO(value);
    }

    public get value(): number {
        return Number(this.expectedBalance);
    }
}