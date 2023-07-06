import { IntlValue } from 'src/codebase/types/IntlValue';

export class TicketTagDTO {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public nameIntl: IntlValue,
    public descriptionIntl: IntlValue,
  ) {}
}
