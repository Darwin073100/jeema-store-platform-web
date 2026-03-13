export class CashSessionClosingNotesVO {
    private readonly closingNotes: string | null;
    
    private constructor(value: string | null){
        this.closingNotes = value;
    }

    /**
     * Método para instanciar el objeto de valor y lógica de dominio.
     * @param value 
     * @returns 
     */
    public static create(value: string | null){
        if(!value || value.trim().length === 0) return new CashSessionClosingNotesVO(null);
        return new CashSessionClosingNotesVO(value);
    }

    public get value(): string | null {
        return this.closingNotes;
    }
}