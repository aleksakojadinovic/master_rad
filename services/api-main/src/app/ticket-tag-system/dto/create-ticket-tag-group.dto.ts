import { IntlValue } from 'src/codebase/types/IntlValue';

export class CreateTicketTagGroupDTO {
  constructor(
    public nameIntl: IntlValue,
    public descriptionIntl: IntlValue,
    public exclusive: boolean,
    public canCreatorAdd: boolean,
    public canCreatorRemove: boolean,
    public canAddRoles: string[],
    public canRemoveRoles: string[],
  ) {}
}
