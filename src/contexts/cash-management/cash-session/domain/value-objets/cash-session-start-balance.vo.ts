import { CashSessionInvalidException } from "../exceptions/cash-session-invalid.exception";

export class CashSessionStartBalanceVO {
    private readonly startBalance: number;
    
    private constructor(value: number){
        this.startBalance = value;
    }

    /**
     * Método para instanciar el objeto de valor y lógica de dominio.
     * @param value 
     * @returns 
     */
    public static create(value: number){
        if(value <= 0){
            throw new CashSessionInvalidException('La apertura de caja debe ser mayor a $0.00');
        }
        return new CashSessionStartBalanceVO(value);
    }

    public get value(): number {
        return Number(this.startBalance);
    }
}