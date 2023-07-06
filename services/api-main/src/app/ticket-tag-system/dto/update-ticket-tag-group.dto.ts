import { Expose, Transform } from 'class-transformer';
import { IntlValue } from 'src/codebase/types/IntlValue';

export class UpdateTicketTagGroupDTO {
  @Expose()
  @Transform((value: any) => {
    // console.log('transforming', value);
    console.log('qwe');
    return value.nameIntl ?? null;
  })
  public nameIntl?: IntlValue | null;

  @Expose()
  @Transform((value: any) => value.descriptionIntl ?? null)
  public descriptionIntl?: IntlValue | null;

  @Expose()
  @Transform((value: any) => value.permissions ?? null)
  public permissions?: any | null;
}
