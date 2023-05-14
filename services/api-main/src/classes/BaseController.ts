import { BadRequestException } from '@nestjs/common';
import { EntityQueryDTO } from '../dto/EntityQueryDTO';
import { ServiceErrors } from 'src/errors';

export abstract class BaseController {
  getDefaultIncludeKeys(): string[] {
    return [];
  }

  getValidIncludeKeys(): string[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  validateEntityQueryDTO(query: EntityQueryDTO): void {
    const defaultIncludeKeys = this.getDefaultIncludeKeys();
    const providedValidIncludeKeys = this.getValidIncludeKeys();
    const validIncludeKeys =
      providedValidIncludeKeys.length === 0
        ? defaultIncludeKeys
        : providedValidIncludeKeys;

    (query.includes ?? []).forEach((includeKey) => {
      if (includeKey.length === 0) {
        throw new BadRequestException({
          type: ServiceErrors.VALIDATION_FAILED,
          message: 'Empty include key found',
        });
      }
      if (!validIncludeKeys.includes(includeKey)) {
        throw new BadRequestException({
          type: ServiceErrors.VALIDATION_FAILED,
          message: `Invalid include key ${includeKey}`,
        });
      }
    });
  }

  enforcePagination(query: EntityQueryDTO): void {
    if (query.page == null || query.perPage == null) {
      throw new BadRequestException({
        type: ServiceErrors.VALIDATION_FAILED,
        message: `Pagination is required for this endpoint`,
      });
    }
  }
}
