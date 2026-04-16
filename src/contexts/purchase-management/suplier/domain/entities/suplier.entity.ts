import { SuplierNameVO } from "../value-objects/suplier-name.vo";
import { SuplierRFCVO } from "../value-objects/suplier-rfc.vo";
import { SuplierContactPersonVO } from "../value-objects/suplier-contact-person.vo";
import { SuplierPhoneNumberVO } from "../value-objects/suplier-phone-number.vo";
import { SuplierEmailVO } from "../value-objects/suplier-email.vo";
import { SuplierNotesVO } from "../value-objects/suplier-notes.vo";
import { LotEntity } from "src/contexts/purchase-management/lot/domain/entities/lot.entity";
import { EstablishmentEntity } from "src/contexts/establishment-management/establishment/domain/entities/establishment.entity";
import { AddressEntity } from "@/contexts/establishment-management/address/domain/entities/address.entity";
  
  export class SuplierEntity {
    private readonly _suplierId: bigint;
    private _establishmentId: bigint;
    private _addressId: bigint | null;
    private _name: SuplierNameVO;
    private _contactPerson: SuplierContactPersonVO;
    private _phoneNumber: SuplierPhoneNumberVO;
    private _email: SuplierEmailVO;
    private _rfc: SuplierRFCVO;
    private _notes: SuplierNotesVO;
    private _address: AddressEntity | null;
    private _lots: LotEntity[] | null;
    private _establishment: EstablishmentEntity | null;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _deletedAt: Date | null;

    private constructor(
      suplierId: bigint,
      establishmentId: bigint,
      addressId: bigint | null,
      name: SuplierNameVO,
      contactPerson: SuplierContactPersonVO,
      phoneNumber: SuplierPhoneNumberVO,
      email: SuplierEmailVO,
      rfc: SuplierRFCVO,
      notes: SuplierNotesVO,
      address: AddressEntity | null, // La dirección es parte de la sucursal
      lots: LotEntity[] | null,
      establishment: EstablishmentEntity | null,
      createdAt: Date,
      updatedAt: Date | null,
      deletedAt: Date | null
    ) {
        this._suplierId = suplierId;
        this._establishmentId = establishmentId;
        this._addressId = addressId;
        this._name = name;
        this._rfc = rfc;
        this._phoneNumber = phoneNumber;
        this._contactPerson = contactPerson;
        this._email = email;
        this._notes = notes;
        this._address = address;
        this._lots = lots;
        this._establishment = establishment;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
    }
  
    get suplierId(): bigint { return this._suplierId; }
    get establishmentId(){ return this._establishmentId; }
    get addressId(){ return this._addressId; }
    get name() { return this._name.value; }
    get phoneNumber(){ return this._phoneNumber.value; }
    get email(){ return this._email.value; }
    get contactPerson(){ return this._contactPerson.value; }
    get rfc(){ return this._rfc.value; }
    get notes(){ return this._notes.value; }
    get address(): AddressEntity | null { return this._address; }
    get lots(): LotEntity[] | null { return this._lots; }
    get establishment(){ return this._establishment; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date | null { return this._updatedAt; }
    get deletedAt(): Date | null { return this._deletedAt; }

    public static create(
      establishmentId: bigint,
      addressId: bigint | null,
      name: string,
      contactPerson: string | null,
      phoneNumber: string | null,
      email: string | null,
      rfc: string | null,
      notes: string | null,
      address: AddressEntity | null,
    ): SuplierEntity {
      const suplier = new SuplierEntity(
        BigInt(0),
        establishmentId,
        addressId,
        SuplierNameVO.create(name),
        SuplierContactPersonVO.create(contactPerson),
        SuplierPhoneNumberVO.create(phoneNumber),
        SuplierEmailVO.create(email),
        SuplierRFCVO.create(rfc),
        SuplierNotesVO.create(notes),
        address,
        null,
        null,
        new Date(),
        null,
        null,
      );
      return suplier;
    }
  
    public static reconstitute(
      suplierId: bigint,
      establishmentId: bigint,
      addressId: bigint | null,
      name: string,
      contactPerson: string | null,
      phoneNumber: string | null,
      email: string | null,
      rfc: string | null,
      notes: string | null,
      address: AddressEntity | null,
      lots: LotEntity[] | null,
      establishment: EstablishmentEntity | null,
      createdAt: Date,
      updatedAt: Date | null,
      deletedAt: Date | null,
    ): SuplierEntity {
      return new SuplierEntity(
        suplierId,
        establishmentId,
        addressId,
        SuplierNameVO.create(name),
        SuplierContactPersonVO.create(contactPerson),
        SuplierPhoneNumberVO.create(phoneNumber),
        SuplierEmailVO.create(email),
        SuplierRFCVO.create(rfc),
        SuplierNotesVO.create(notes),
        address,
        lots,
        establishment,
        createdAt,
        updatedAt,
        deletedAt,
      );
    }

    public updateAddressId(addressId: bigint | null){
      this._addressId = addressId;
    }
  }