import { Transform } from 'class-transformer';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { Role } from '../../domain/value-objects/role';
import { UserStatus } from '../../domain/value-objects/user-status';

export class UsersQueryDTO extends EntityQueryDTO {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value || [];
  })
  roles: Role[] = [];

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value || [];
  })
  statuses: UserStatus[] = [];
}
