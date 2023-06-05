import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { TicketStatus } from '../types';
import { Transform } from 'class-transformer';

export class TicketQueryDTO extends EntityQueryDTO {
  constructor(
    searchString = '',
    includes: string[] = [],
    sortBy: string = null,
    page: number | null = null,
    perPage: number | null = null,
    status: TicketStatus | null = null,
  ) {
    super(searchString, includes, sortBy, page, perPage);
    this.status = status;
  }

  @Transform(({ value }) =>
    value.split(',').map((status) => TicketStatus[status]),
  )
  status?: TicketStatus;
}
