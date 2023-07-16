import { Injectable } from '@nestjs/common';
import { EntityQueryPipe } from 'src/codebase/pipes/entity-query.pipe';

@Injectable()
export class UsersQueryPipe extends EntityQueryPipe {
  private static USERS_ALLOWED_INCLUDE_KEYS = ['roles'];
  private static USERS_ALLOWED_SORT_KEYS = ['id'];
  private static USERS_ALLOWED_FILTER_KEYS = ['roles'];

  constructor(
    enforcePagination = false,
    allowedIncludeKeys = UsersQueryPipe.USERS_ALLOWED_INCLUDE_KEYS,
    allowedSortKeys = UsersQueryPipe.USERS_ALLOWED_SORT_KEYS,
    allowedFilterKeys = UsersQueryPipe.USERS_ALLOWED_FILTER_KEYS,
  ) {
    super(
      allowedIncludeKeys,
      allowedSortKeys,
      allowedFilterKeys,
      enforcePagination,
    );
  }
}
