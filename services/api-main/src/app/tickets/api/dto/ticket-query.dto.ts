import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class TicketQueryDTO extends EntityQueryDTO {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    if (value == null) {
      return null;
    }

    return value as string[];
  })
  statuses: string[] | null = null;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    if (value == null) {
      return null;
    }

    return value as string[];
  })
  notStatuses: string[] | null = null;

  @IsOptional()
  @Transform(({ value }) => value || null)
  assignee: string | null = null;

  @IsOptional()
  @Transform(({ value }) => value || null)
  unassigned: boolean | null = null;

  @IsOptional()
  @Transform(({ value }) => value || null)
  createdBy: string | null = null;
}
