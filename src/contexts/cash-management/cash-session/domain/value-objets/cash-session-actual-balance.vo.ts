export class CashSessionActualBalanceVO {
    private readonly actualBalance: number | null;
    
    private constructor(value: number | null){
        this.actualBalance = value;
    }

    /**
     * Método para instanciar el objeto de valor y lógica de dominio.
     * @param value 
     * @returns 
     */
    public static create(value: number | null){
        if(!value) return new CashSessionActualBalanceVO(null);
        return new CashSessionActualBalanceVO(value);
    }

    public get value(): number {
        return Number(this.actualBalance);
    }
}