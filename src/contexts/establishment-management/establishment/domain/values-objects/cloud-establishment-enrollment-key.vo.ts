export class CloudEstablishmentEnrollmentVO {
    private _name: string | null;
    private constructor(name: string | null){
        this._name = name;
        Object.freeze(this);
    }

    public static create(value: string | null){
        if(!value) return new CloudEstablishmentEnrollmentVO(value);
        if(value.trim().length <= 3){
            throw new Error('La llave debe tener mas de 3 caracteres');
        }
        if(value.trim().length > 250){
            throw new Error('La llave es muy larga. Máximo 255 caracteres.');
        }
        return new CloudEstablishmentEnrollmentVO(value);
    }
    get value(): string | null{
        return this._name;
    }
}