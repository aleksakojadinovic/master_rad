import { Transform } from 'class-transformer';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';

export class UsersQueryDTO extends EntityQueryDTO {
  constructor(
    searchString = '',
    includes: string[] = [],
    sortBy: string = null,
    page: number | null = null,
    perPage: number | null = null,
    roles: string[] | null = null,
  ) {
    super(searchString, includes, sortBy, page, perPage);
    this.roles = roles;
  }

  @Transform(({ value }) => {
    return value ?? null;
  })
  roles: string[] | null;
}
