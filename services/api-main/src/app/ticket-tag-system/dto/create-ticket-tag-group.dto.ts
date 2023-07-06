import { IntlValue } from 'src/codebase/types/IntlValue';

export class CreateTicketTagGroupDTO {
  constructor(
    public nameIntl: IntlValue,
    public descriptionIntl: IntlValue,
    public exclusive: boolean,
    public canAddRoles: string[],
    public canRemoveRoles: string[],
  ) {}
}
