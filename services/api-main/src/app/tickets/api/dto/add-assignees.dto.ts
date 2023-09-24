import { IsArray, Validate } from 'class-validator';
import { isValidObjectId } from 'mongoose';

export class AddAssigneesDTO {
  @Validate(isValidObjectId, { each: true })
  @IsArray()
  assignees: string[];
}
