import { IntlValue } from 'src/codebase/types/IntlValue';
import { TicketTagGroupPermissionsDTO } from './ticket-tag-group-permissions.dto';
import { TicketTagDTO } from './ticket-tag.dto';

export class TicketTagGroupDTO {
  constructor(
    public id: string,
    public tags: TicketTagDTO[],
    public permissions: TicketTagGroupPermissionsDTO,
    public name: string,
    public description: string,
    public nameIntl: IntlValue,
    public descriptionIntl: IntlValue,
  ) {}
}
