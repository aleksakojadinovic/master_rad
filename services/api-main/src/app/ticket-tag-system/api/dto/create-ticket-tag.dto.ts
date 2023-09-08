import { Expose } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { IsValidObjectId } from 'src/codebase/pipes/objectid-pipe';
import { IntlValue } from 'src/codebase/types/IntlValue';

// TODO rename to createOrUpdate
export class CreateTicketTagDTO {
  @Expose()
  @IsOptional()
  @Validate(IsValidObjectId)
  public id?: string | null;

  @Expose()
  public nameIntl: IntlValue;

  @Expose()
  public descriptionIntl: IntlValue;
}
