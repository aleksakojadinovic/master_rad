import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { Transform } from 'class-transformer';

export class TicketQueryDTO extends EntityQueryDTO {
  @Transform(({ value }) => value || null)
  status: string | null = null;
}
