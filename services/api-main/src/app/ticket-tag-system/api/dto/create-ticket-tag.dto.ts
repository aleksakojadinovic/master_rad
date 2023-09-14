import { Expose } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { IsValidObjectId } from 'src/codebase/pipes/objectid-pipe';
import { IntlValue } from 'src/codebase/types/IntlValue';

export class CreateOrUpdateTicketTagDTO {
  @Expose()
  @IsOptional()
  @Validate(IsValidObjectId)
  public id?: string | null;

  @Expose()
  public nameIntl: IntlValue;

  @Expose()
  public descriptionIntl: IntlValue;
}
