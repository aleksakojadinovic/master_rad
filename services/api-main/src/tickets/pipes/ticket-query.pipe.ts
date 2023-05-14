import { PipeTransform, Injectable } from '@nestjs/common';
import { TicketQueryDTO } from '../dto/ticket-query.dto';

@Injectable()
export class TicketQueryPipe implements PipeTransform<any, TicketQueryDTO> {
  transform(value: any): TicketQueryDTO {
    return new TicketQueryDTO(
      value.searchString ?? '',
      value.includes ? value.includes.split(',') : [],
      value.sortBy ?? '',
      value.page ?? null,
      value.perPage ?? null,
      value.statuses ? value.statuses.split(',') : [],
    );
  }
}
