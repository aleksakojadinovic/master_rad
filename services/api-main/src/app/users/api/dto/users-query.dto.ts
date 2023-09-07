import { Transform } from 'class-transformer';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';

export class UsersQueryDTO extends EntityQueryDTO {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value || [];
  })
  roles: string[] = [];
}
