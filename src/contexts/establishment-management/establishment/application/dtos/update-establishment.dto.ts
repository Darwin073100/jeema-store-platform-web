export class UpdateEstablishmentDto{
    readonly establishmentId: bigint;
    readonly name: string | null;

    constructor(establishmentId: bigint, name: string | null){
        this.establishmentId = establishmentId;
        this.name = name;
    }
}