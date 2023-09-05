import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class TicketQueryDTO extends EntityQueryDTO {
  @Transform(({ value }) => value || null)
  status: string | null = null;

  @IsOptional()
  @Transform(({ value }) => value || null)
  assignedTo: string | null = null;
}
