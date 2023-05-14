import { EntityQueryDTO } from 'src/dto/EntityQueryDTO';
import { TicketStatus } from '../types';
import { Transform } from 'class-transformer';

export class TicketQueryDTO extends EntityQueryDTO {
  constructor(
    searchString = '',
    includes: string[] = [],
    sortBy: string[] = [],
    page: number | null = null,
    perPage: number | null = null,
    statuses: TicketStatus[] = [],
  ) {
    super(searchString, includes, sortBy, page, perPage);
    this.statuses = statuses;
  }

  @Transform(({ value }) =>
    value.split(',').map((status) => TicketStatus[status]),
  )
  statuses?: TicketStatus[];
}
