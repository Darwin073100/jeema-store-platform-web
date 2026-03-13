import { IsEnum } from "class-validator";
import { BarcodeTypeEnum } from "../../enums/barcode-type.enum";

export class BarcodeRequestDTO{
    @IsEnum(BarcodeTypeEnum,{message: `Debes elegr una opcion valida para el codigo de barras(${Object.values(BarcodeTypeEnum)})`})
    barcodeType: BarcodeTypeEnum
}