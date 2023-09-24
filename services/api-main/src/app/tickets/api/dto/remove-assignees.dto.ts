import { IsArray, Validate } from 'class-validator';
import { isValidObjectId } from 'mongoose';

export class RemoveAssigneesDTO {
  @Validate(isValidObjectId, { each: true })
  @IsArray()
  assignees: string[];
}
