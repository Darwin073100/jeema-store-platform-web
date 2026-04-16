import { BranchOfficeEntity } from "src/contexts/establishment-management/branch-office/domain/entities/branch-office.entity";
import { EmployeeEntity } from "src/contexts/employee-management/employee/domain/entities/employee.entity";
import { AddressStreetVO } from "../value-objects/address-street.vo";
import { AddressExternalNumberVO } from "../value-objects/address-external-number.vo";
import { AddressInternalNumberVO } from "../value-objects/address-internal-number.vo";
import { AddressNeighborhoodVO } from "../value-objects/address-neighborhood.vo";
import { AddressMunicipalityVO } from "../value-objects/address-municipality.vo";
import { AddressCityVO } from "../value-objects/address-city.vo";
import { AddressStateVO } from "../value-objects/address-state.vo";
import { AddressPostalCodeVO } from "../value-objects/address-postal-code.vo";
import { AddressCountryVO } from "../value-objects/address-country.vo";
import { SuplierEntity } from "@/contexts/purchase-management/suplier/domain/entities/suplier.entity";

export class AddressEntity  {
    private readonly _addressId: bigint;
    private _street: AddressStreetVO; // Calle // Juan ruiz de alarcon
    private _externalNumber: AddressExternalNumberVO; // Número exterior // 23
    private _internalNumber: AddressInternalNumberVO; // Número Interior Opcional //SN
    private _neighborhood: AddressNeighborhoodVO; // Colonia
    private _municipality: AddressMunicipalityVO; // Municipio
    private _city: AddressCityVO; // Ciudad //Ometepec
    private _state: AddressStateVO; // Estado // Guerrero
    private _postalCode: AddressPostalCodeVO; // Código Postal // 41700
    private _country: AddressCountryVO; // País // México
    private _reference: string|null; // Referencia //
    private readonly _createdAt: Date;
    private readonly _updatedAt: Date | null;
    private readonly _deletedAt: Date | null;
    private readonly _branchOffice: BranchOfficeEntity | null;
    private readonly _employee: EmployeeEntity | null;
    private readonly _suplier: SuplierEntity | null;

    constructor(
        addressId: bigint,
        street: AddressStreetVO, // Calle // Juan ruiz de alarcon
        externalNumber: AddressExternalNumberVO, // Número exterior // 23
        internalNumber: AddressInternalNumberVO, // Número Interior Opcional //SN
        neighborhood: AddressNeighborhoodVO, // Colonia
        municipality: AddressMunicipalityVO, // Municipio
        city: AddressCityVO, // Ciudad //Ometepec
        state: AddressStateVO, // Estado // Guerrero
        postalCode: AddressPostalCodeVO, // Código Postal // 41700
        country: AddressCountryVO, // País // México
        reference: string|null, // Referencia //
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        branchOffice: BranchOfficeEntity | null,
        employee: EmployeeEntity | null,
        suplier: SuplierEntity | null,
    ){
        this._addressId = addressId;
        this._street = street;
        this._externalNumber = externalNumber;
        this._internalNumber = internalNumber;
        this._neighborhood = neighborhood;
        this._municipality = municipality;
        this._city = city;
        this._state = state;
        this._postalCode = postalCode;
        this._country = country;
        this._reference = reference;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._branchOffice = branchOffice;
        this._employee = employee;
        this._suplier = suplier;
    }

    get addressId(){ return this._addressId; }
    get street() { return this._street.value; }
    get externalNumber() { return this._externalNumber.value; }
    get internalNumber(){ return this._internalNumber.value; }
    get neighborhood(){ return this._neighborhood.value; }
    get municipality(){ return this._municipality.value; }
    get city() { return this._city.value; }
    get state() { return this._state.value; }
    get postalCode(){ return this._postalCode.value; }
    get createdAt(){ return this._createdAt; }
    get updatedAt(){ return this._updatedAt; }
    get deletedAt(){ return this._deletedAt; }
    get country(){ return this._country.value; }
    get reference(){ return this._reference; }
    get branchOffice(){ return this._branchOffice; }
    get employee(){ return this._employee; }
    get suplier(){ return this._suplier; }

    public static create(
        country: string, // País // México
        state: string, // Estado // Guerrero
        postalCode: string, // Código Postal // 41700
        municipality: string, // Municipio
        city: string, // Ciudad //Ometepec
        street: string | null, // Calle // Juan ruiz de alarcon
        externalNumber: string | null, // Número exterior // 23
        internalNumber: string | null, // Número Interior Opcional //SN
        neighborhood: string | null, // Colonia
        reference: string|null
    ){    
        return new AddressEntity(
            BigInt(0),
            AddressStreetVO.create(street),
            AddressExternalNumberVO.create(externalNumber),
            AddressInternalNumberVO.create(internalNumber),
            AddressNeighborhoodVO.create(neighborhood),
            AddressMunicipalityVO.create(municipality),
            AddressCityVO.create(city),
            AddressStateVO.create(state),
            AddressPostalCodeVO.create(postalCode),
            AddressCountryVO.create(country),
            reference,
            new Date(),
            null,
            null,
            null,
            null,
            null
        )
    }

    public static reconstitute(
        addressId: bigint,
        country: string, // País // México
        state: string, // Estado // Guerrero
        postalCode: string, // Código Postal // 41700
        municipality: string, // Municipio
        city: string, // Ciudad //Ometepec
        street: string | null, // Calle // Juan ruiz de alarcon
        externalNumber: string | null, // Número exterior // 23
        internalNumber: string | null, // Número Interior Opcional //SN
        neighborhood: string | null, // Colonia
        reference: string|null,
        createdAt: Date,
        updatedAt: Date | null,
        deletedAt: Date | null,
        branchOffice: BranchOfficeEntity | null,
        employee: EmployeeEntity | null,
        suplier: SuplierEntity | null,
    ) {
        return new AddressEntity(
            addressId,
            AddressStreetVO.create(street),
            AddressExternalNumberVO.create(externalNumber),
            AddressInternalNumberVO.create(internalNumber),
            AddressNeighborhoodVO.create(neighborhood),
            AddressMunicipalityVO.create(municipality),
            AddressCityVO.create(city),
            AddressStateVO.create(state),
            AddressPostalCodeVO.create(postalCode),
            AddressCountryVO.create(country),
            reference,
            createdAt,
            updatedAt,
            deletedAt,
            branchOffice,
            employee,
            suplier,
        )
    }

    public updateStreet(street: string | null){
        this._street = AddressStreetVO.create(street);
    }
    public updateExternalNumber(externalNumber: string | null){
        this._externalNumber = AddressExternalNumberVO.create(externalNumber);
    }
    public updateInternalNumber(internalNumber: string | null){
        this._internalNumber = AddressInternalNumberVO.create(internalNumber);
    }
    public updateNeighborhood(neighborhood: string | null){
        this._neighborhood = AddressNeighborhoodVO.create(neighborhood);
    }
    public updateCity(city: string){
        this._city = AddressCityVO.create(city);
    }
    public updateCountry(country: string){
        this._country = AddressCountryVO.create(country);
    }
    public updateState(state: string){
        this._state = AddressStateVO.create(state);
    }
    public updateMunicipality(municipality: string){
        this._municipality = AddressMunicipalityVO.create(municipality);
    }
    public updatePostalCode(postalCode: string){
        this._postalCode = AddressPostalCodeVO.create(postalCode);
    }
    public updateReference(reference: string | null){
        this._reference = reference;
    }
  }