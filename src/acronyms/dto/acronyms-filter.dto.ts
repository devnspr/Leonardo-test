import { AcronymsFiltersInterface } from '../interfaces/acronyms-filters.interface';

export class AcronymsFilterDto implements AcronymsFiltersInterface {
  from?: number;
  limit?: number;
  search?: string;
}
