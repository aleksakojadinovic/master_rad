import { IntlValue } from 'src/codebase/types/IntlValue';

export class UpdateTicketTagGroupDTO {
  constructor(
    public action: string,
    public payload: any,
    public nameIntl: IntlValue,
    public descriptionIntl: IntlValue,
  ) {}
}
