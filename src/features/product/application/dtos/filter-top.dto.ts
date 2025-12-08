import { FilterTopEnum } from "../../domain/enums/filter-top-enum";

export class FilterTopRequestDTO{
    filterBy?: FilterTopEnum;
    limit?: number;
}