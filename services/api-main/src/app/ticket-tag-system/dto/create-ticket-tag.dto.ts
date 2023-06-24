import { IntlValue } from 'src/codebase/types/IntlValue';

export class CreateTicketTagDto {
  constructor(
    public nameIntl: IntlValue,
    public descriptionIntl: IntlValue,
    public groupId: string,
  ) {}
}
