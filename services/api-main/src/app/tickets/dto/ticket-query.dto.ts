import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { Transform } from 'class-transformer';

// export class TicketQueryDTO extends EntityQueryDTO {
//   constructor(
//     searchString = '',
//     includes: string[] = [],
//     sortBy: string = null,
//     page: number | null = null,
//     perPage: number | null = null,
//     status: TicketStatus | null = null,
//   ) {
//     super(searchString, includes, sortBy, page, perPage);
//     this.status = status;
//   }

//   @Transform(({ value }) => TicketStatus[value] ?? null)
//   status?: TicketStatus;
// }

export class TicketQueryDTO extends EntityQueryDTO {
  @Transform(({ value }) => value || null)
  status: string | null = null;
}
