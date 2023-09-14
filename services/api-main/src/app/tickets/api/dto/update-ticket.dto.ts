import { IsArray, IsOptional, Validate } from 'class-validator';
import { isValidObjectId } from 'mongoose';
import { TicketStatus } from '../../domain/value-objects/ticket-status';

export class UpdateTicketDto {
  status?: TicketStatus;
  body?: string;
  comment?: string;
  isCommentInternal?: boolean;
  title?: string;

  @Validate(isValidObjectId, { each: true })
  @IsOptional()
  @IsArray()
  addAssignees?: string[];

  @Validate(isValidObjectId, { each: true })
  @IsOptional()
  @IsArray()
  removeAssignees?: string[];

  @Validate(isValidObjectId, { each: true })
  @IsOptional()
  @IsArray()
  addTags?: string[];

  @Validate(isValidObjectId, { each: true })
  @IsOptional()
  @IsArray()
  removeTags?: string[];
}
