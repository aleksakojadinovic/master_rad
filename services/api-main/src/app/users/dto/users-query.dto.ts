import { Transform } from 'class-transformer';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';

export class UsersQueryDTO extends EntityQueryDTO {
  constructor(
    searchString = '',
    includes: string[] = [],
    sortBy: string = null,
    page: number | null = null,
    perPage: number | null = null,
    role: string | null = null,
  ) {
    super(searchString, includes, sortBy, page, perPage);
    this.role = role;
  }

  @Transform(({ value }) => {
    return value ?? null;
  })
  role: string | null;
}
