import { FilterTopEnum } from "../../domain/enums/FilterTopEnum";

export interface FilterTopRequestDTO{
    filterBy?: FilterTopEnum;
    limit?: number;
}