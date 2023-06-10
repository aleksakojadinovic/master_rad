import { Injectable } from '@nestjs/common';
import { EntityQueryPipe } from 'src/codebase/pipes/entity-query.pipe';

@Injectable()
export class TicketTagGroupQueryPipe extends EntityQueryPipe {
  private static TICKET_TAG_GROUP_ALLOWED_INCLUDE_KEYS = ['role'];
  private static TICKET_TAG_GROUP_ALLOWED_SORT_KEYS = [];
  private static TICKET_TAG_GROUP_ALLOWED_FILTER_KEYS = [];

  constructor(
    enforcePagination = false,
    allowedIncludeKeys = TicketTagGroupQueryPipe.TICKET_TAG_GROUP_ALLOWED_INCLUDE_KEYS,
    allowedSortKeys = TicketTagGroupQueryPipe.TICKET_TAG_GROUP_ALLOWED_SORT_KEYS,
    allowedFilterKeys = TicketTagGroupQueryPipe.TICKET_TAG_GROUP_ALLOWED_FILTER_KEYS,
  ) {
    super(
      allowedIncludeKeys,
      allowedSortKeys,
      allowedFilterKeys,
      enforcePagination,
    );
  }
}
