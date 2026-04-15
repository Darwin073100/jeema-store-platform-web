import { CloudEstablishmentEnrollmentVO } from "../values-objects/cloud-establishment-enrollment-key.vo";
import { EstablishmentNameVO } from "../values-objects/establishment-name.vo";

export class EstablishmentEntity {
    private readonly _establishmentId: bigint;
    private _cloudEstablishmentId: bigint | null;
    private _enrollmentKey: CloudEstablishmentEnrollmentVO;
    private _name: EstablishmentNameVO;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;
    private _branchOffices: any[] | null;
    private _products: any[] | null;
    private _customers: any[] | null;
    private _supliers: any[] | null;

    private constructor(
    establishmentId: bigint,
    cloudEstablishmentId: bigint | null,
    enrollmentKey: CloudEstablishmentEnrollmentVO,
    name: EstablishmentNameVO,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    branchOffices: any[] | null,
    products: any[] | null,
    customers: any[] | null,
    supliers: any[] | null,
    ) {
        this._establishmentId = establishmentId;
        this._cloudEstablishmentId = cloudEstablishmentId;
        this._enrollmentKey = enrollmentKey;
        this._name = name;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._branchOffices = branchOffices;
        this._products = products;
        this._customers = customers;
        this._supliers = supliers;
    }

    /**
   * Crea una nueva instancia de Establishment.
   * Este es un método de fábrica para asegurar la creación controlada del agregado.
   * Un evento de dominio EstablishmentCreatedEvent se registra internamente.
   *
   * @param name El nombre del centro educativo.
   * @returns Una nueva instancia de Establishment.
   */
  static create(name: string): EstablishmentEntity {
    const establishment = new EstablishmentEntity(
      BigInt(0),
      null,
      CloudEstablishmentEnrollmentVO.create(null),
      EstablishmentNameVO.create(name),
      new Date(), // createdAt
      null, // updatedAt
      null, // deletedAt
      null,
      null,
      null,
      null,
    );
    return establishment;
  }

  /**
   * Reconstituye una instancia de Establishment desde la persistencia.
   * No emite eventos ya que representa un estado ya existente.
   *
   * @param establishmentId El ID único del centro educativo.
   * @param name El nombre del centro educativo.
   * @param createdAt La fecha de creación.
   * @param updatedAt La fecha de la última actualización.
   * @param deletedAt La fecha de borrado lógico.
   * @returns Una instancia de Establishment reconstituida.
   */
  static reconstitute(
    establishmentId: bigint,
    cloudEstablishmentId: bigint | null,
    enrollmentKey: string | null,
    name: string,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    branchOffices: any[] | null,
    products: any[] | null,
    customers: any[] | null,
    supliers: any[] | null,
  ): EstablishmentEntity {
    return new EstablishmentEntity(
      establishmentId, 
      cloudEstablishmentId,
      CloudEstablishmentEnrollmentVO.create(enrollmentKey),
      EstablishmentNameVO.create(name), 
      createdAt, 
      updatedAt, 
      deletedAt, 
      branchOffices, 
      products, 
      customers,
      supliers,
    );
  }

  // Getters
  get establishmentId(): bigint { return this._establishmentId; }
  get cloudEstablishmentId(): bigint | null { return this._cloudEstablishmentId; }
  get enrollmentKey(): string | null { return this._enrollmentKey.value; }
  get name(): string { return this._name.value; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date | null { return this._updatedAt; }
  get deletedAt(): Date | null { return this._deletedAt; }
  get products(): any[] | null { return this._products; }
  get customers(): any[] | null { return this._customers; }
  get branchOffices(){ return this._branchOffices; }
  get supliers(){ return this._supliers; }

  public updateName(name: string){
    this._name = EstablishmentNameVO.create(name);
    this._updatedAt= new Date();
  }
  public updateCloudEstablishmentId(id: bigint | null){
    this._cloudEstablishmentId = id;
    this._updatedAt = new Date();
  }
  public updateEnrollmentKey(key: string | null){
    this._enrollmentKey = CloudEstablishmentEnrollmentVO.create(key);
    this._updatedAt = new Date();
  }
}

