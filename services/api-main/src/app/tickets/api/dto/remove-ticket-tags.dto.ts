import { IsArray, Validate } from 'class-validator';
import { isValidObjectId } from 'mongoose';

export class RemoveTicketTagsDTO {
  @Validate(isValidObjectId, { each: true })
  @IsArray()
  tags: string[];
}
