import { Injectable } from '@nestjs/common';
import { EntityQueryPipe } from 'src/codebase/pipes/entity-query.pipe';

@Injectable()
export class TicketQueryPipe extends EntityQueryPipe {
  private static TICKETS_ALLOWED_INCLUDE_KEYS = [
    'createdBy',
    'historyInitiator',
    'assignees',
  ];
  private static TICKETS_ALLOWED_SORT_KEYS = ['id'];
  private static TICKETS_ALLOWED_FILTER_KEYS = ['status'];

  constructor(
    enforcePagination = false,
    allowedIncludeKeys = TicketQueryPipe.TICKETS_ALLOWED_INCLUDE_KEYS,
    allowedSortKeys = TicketQueryPipe.TICKETS_ALLOWED_SORT_KEYS,
    allowedFilterKeys = TicketQueryPipe.TICKETS_ALLOWED_FILTER_KEYS,
  ) {
    super(
      allowedIncludeKeys,
      allowedSortKeys,
      allowedFilterKeys,
      enforcePagination,
    );
  }
}
