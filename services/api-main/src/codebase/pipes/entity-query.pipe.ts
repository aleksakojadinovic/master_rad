import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { InvalidPaginationParametersError } from '../errors/InvalidPaginationParameters';

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
        throw new BadRequestException({
          message: 'Empty include key found',
        });
      }

      if (!this.allowedIncludeKeys.includes(includeKey)) {
        throw new BadRequestException({
          message: `Invalid include key ${includeKey}`,
        });
      }
    });

    if (sortKey !== null && !this.allowedSortKeys.includes(sortKey)) {
      throw new BadRequestException({
        message: `Invalid sort key ${sortKey}`,
      });
    }

    filterKeys.forEach((filterKey) => {
      if (!this.allowedFilterKeys.includes(filterKey)) {
        throw new BadRequestException({
          message: `Invalid filter key ${filterKey}`,
        });
      }
    });

    if (this.enforcePagination) {
      if (value.page == null || value.perPage == null) {
        throw new BadRequestException({
          message: `Pagination is required`,
        });
      }
    }

    if (
      (value.page != null && value.perPage == null) ||
      (value.page == null && value.perPage != null)
    ) {
      throw new BadRequestException({
        message: `Pagination requires both page and perPage`,
      });
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
