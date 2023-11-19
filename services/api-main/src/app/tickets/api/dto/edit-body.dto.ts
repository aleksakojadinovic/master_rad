import { IsString, MinLength } from 'class-validator';

export class EditBodyDTO {
  @IsString()
  @MinLength(100)
  title: string;
}
