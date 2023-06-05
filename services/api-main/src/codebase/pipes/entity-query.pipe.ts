import { PipeTransform, Injectable } from '@nestjs/common';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { InvalidPaginationParametersError } from '../errors/InvalidPaginationParameters';
import { InvalidIncludeKeyError } from '../errors/InvalidIncludeKey';
import { InvalidSortKey } from '../errors/InvalidSortKey';
import { InvalidFilterKeyError } from '../errors/InvalidFilterKey';
import { PaginationRequiredError } from '../errors/PaginationRequired';

@Injectable()
export class EntityQueryPipe implements PipeTransform<any, EntityQueryDTO> {
  constructor(
    private allowedIncludeKeys: string[],
    private allowedSortKeys: string[],
    private allowedFilterKeys: string[],
    private enforcePagination: boolean,
  ) {}
  transform(value: any): EntityQueryDTO {
    const includeKeys = value.includes ? value.includes.split(',') : [];
    const sortKey = value.sortBy ?? null;
    const filterKeys = Object.keys(value.filterKeys ?? {});

    // TODO: Maybe interceptor should handle this but idk
    includeKeys.forEach((includeKey) => {
      if (includeKey.length === 0) {
        throw new InvalidIncludeKeyError(includeKey);
      }

      if (!this.allowedIncludeKeys.includes(includeKey)) {
        throw new InvalidIncludeKeyError(includeKey);
      }
    });

    if (sortKey !== null && !this.allowedSortKeys.includes(sortKey)) {
      throw new InvalidSortKey(sortKey);
    }

    filterKeys.forEach((filterKey) => {
      if (!this.allowedFilterKeys.includes(filterKey)) {
        throw new InvalidFilterKeyError(filterKey);
      }
    });

    if (this.enforcePagination) {
      if (value.page == null || value.perPage == null) {
        throw new PaginationRequiredError();
      }
    }

    if (
      (value.page != null && value.perPage == null) ||
      (value.page == null && value.perPage != null)
    ) {
      throw new InvalidPaginationParametersError();
    }

    if (value.page != null) {
      if (isNaN(value.page) || value.page <= 0) {
        throw new InvalidPaginationParametersError();
      }
    }

    if (value.perPage != null) {
      if (isNaN(value.perPage) || value.perPage <= 0) {
        throw new InvalidPaginationParametersError();
      }
    }
    const filters = Object.fromEntries(
      this.allowedFilterKeys
        .map((allowedFilterKey) => {
          return [allowedFilterKey, value[allowedFilterKey]];
        })
        .filter(([, v]) => v !== undefined),
    );

    return new EntityQueryDTO(
      value.searchString ?? '',
      includeKeys,
      value.sortBy ?? '',
      value.page ? parseInt(value.page, 10) : null,
      value.perPage ? parseInt(value.perPage) : null,
      filters,
    );
  }
}
