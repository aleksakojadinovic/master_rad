import { IntlValue } from 'src/codebase/types/IntlValue';
import { TicketTagGroup } from './ticket-tag-group.entity';

export class TicketTag {
  id: string;

  nameIntl: IntlValue;

  descriptionIntl: IntlValue;

  group: TicketTagGroup;
}
