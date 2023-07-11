import { IsArray, IsOptional, Validate } from 'class-validator';
import { TicketStatus } from '../types';
import { isValidObjectId } from 'mongoose';

// TODO: transformer and validator
export class UpdateTicketDto {
  status?: TicketStatus;
  body?: string;
  comment?: string;
  title?: string;
  assignees?: string[];

  @Validate(isValidObjectId, { each: true })
  @IsOptional()
  @IsArray()
  addTags?: string[];

  @Validate(isValidObjectId, { each: true })
  @IsOptional()
  @IsArray()
  removeTags?: string[];
}
