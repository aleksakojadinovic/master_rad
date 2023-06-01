import { EntityQueryDTO } from 'src/dto/EntityQueryDTO';

export abstract class BaseService {
  costructFilters(): any {
    return {};
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructPopulate(queryDTO: EntityQueryDTO): any[] {
    return [];
  }
}
