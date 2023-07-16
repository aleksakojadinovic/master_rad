import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidObjectId } from 'mongoose'; // For Types.ObjectId.isValid()

@ValidatorConstraint({ name: 'isValidObjectId', async: false })
export class IsValidObjectId implements ValidatorConstraintInterface {
  validate(value: any) {
    return isValidObjectId(value);
  }

  defaultMessage() {
    return 'Each element of $property must be a valid MongoDB ObjectId';
  }
}
