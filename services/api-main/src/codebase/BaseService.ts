/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityQueryDTONew } from 'src/codebase/dto/EntityQueryDTO';

export abstract class BaseService {
  costructFilters(): any {
    return {};
  }

  constructPopulateNew(queryDTO: EntityQueryDTONew): any[] {
    return [];
  }
}
