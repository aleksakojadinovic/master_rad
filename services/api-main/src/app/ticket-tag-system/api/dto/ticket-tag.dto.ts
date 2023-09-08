import { IntlValue } from 'src/codebase/types/IntlValue';

export class TicketTagTicketTagGroupDTO {
  constructor(
    public id: string,
    public name: string,
    public description: string,
  ) {}
}
export class TicketTagDTO {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public nameIntl: IntlValue,
    public descriptionIntl: IntlValue,
    public group: TicketTagTicketTagGroupDTO | string,
  ) {}
}
