/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';

export abstract class BaseService {
  costructFilters(): any {
    return {};
  }

  // constructPopulate(): any[] {
  //   return [];
  // }
}
