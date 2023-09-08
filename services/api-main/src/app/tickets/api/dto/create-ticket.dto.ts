import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { MIN_BODY_LENGTH, MIN_TITLE_LENGTH } from '../../constants';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_TITLE_LENGTH)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_BODY_LENGTH)
  body: string;
}
