import { IsArray, IsOptional, Validate } from 'class-validator';
import { TicketStatus } from '../types';
import { isValidObjectId } from 'mongoose';

export class UpdateTicketDto {
  status?: TicketStatus;
  body?: string;
  comment?: string;
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
