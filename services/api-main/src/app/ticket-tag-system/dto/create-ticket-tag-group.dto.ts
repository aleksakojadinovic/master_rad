import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { IntlValue } from 'src/codebase/types/IntlValue';

export class CreateTicketTagGroupDTO {
  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value : null))
  public nameIntl?: IntlValue | null;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value : null))
  public descriptionIntl?: IntlValue | null;
}
