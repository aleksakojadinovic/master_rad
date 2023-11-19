import { IsString, MinLength } from 'class-validator';

export class EditTitleDTO {
  @IsString()
  @MinLength(20)
  title: string;
}
