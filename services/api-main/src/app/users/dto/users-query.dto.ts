import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { EntityQueryDTONew } from 'src/codebase/dto/EntityQueryDTO';

export class UsersQueryDTO extends EntityQueryDTONew {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value || [];
  })
  roles: string[];
}
