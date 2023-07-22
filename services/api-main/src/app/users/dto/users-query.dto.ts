import { Transform } from 'class-transformer';
import { EntityQueryDTONew } from 'src/codebase/dto/EntityQueryDTO';

export class UsersQueryDTO extends EntityQueryDTONew {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value || [];
  })
  roles: string[] = [];
}
