import { Injectable } from '@nestjs/common';
import { EntityQueryPipe } from 'src/codebase/pipes/entity-query.pipe';

@Injectable()
export class TicketTagQueryPipe extends EntityQueryPipe {
  private static TICKET_TAG_ALLOWED_INCLUDE_KEYS = ['group'];
  private static TICKET_TAG_ALLOWED_SORT_KEYS = [];
  private static TICKET_TAG_ALLOWED_FILTER_KEYS = [];

  constructor(
    enforcePagination = false,
    allowedIncludeKeys = TicketTagQueryPipe.TICKET_TAG_ALLOWED_INCLUDE_KEYS,
    allowedSortKeys = TicketTagQueryPipe.TICKET_TAG_ALLOWED_SORT_KEYS,
    allowedFilterKeys = TicketTagQueryPipe.TICKET_TAG_ALLOWED_FILTER_KEYS,
  ) {
    super(
      allowedIncludeKeys,
      allowedSortKeys,
      allowedFilterKeys,
      enforcePagination,
    );
  }
}
